const express = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const crypto = require('crypto')
const mailer = require('../../modules/mailer')

const authConfig = require('../../config/auth.json')

const User = require('../models/user')

const router = express.Router()

function generateToken(params = {}) {
    return jwt.sign(params, authConfig.secret, {
        expiresIn: 86400
    })
}

router.post('/register', async (req, res) => {
    const { email } = req.body

    try {
        if (await User.findOne({ email }))
            return res.send({ message: '<div class="alert alert-warning" role="alert">User already exists</div>' })

        const user = await User.create(req.body)

        user.password = undefined

        return res.send({
            user,
            token: generateToken({ id: user._id }),
            message: '<div class="alert alert-success" role="alert">Registration success</div>'
        })
    } catch (error) {
        res.send({ message: '<div class="alert alert-danger" role="alert">Registration failed</div>' })
    }
})

router.get('/register', (req, res) => {
    res.render('./templates/register.html')
})

router.post('/login', async (req, res) => {

    const { email, password } = req.body

    const user = await User.findOne({ email }).select('+password')

    if (!user)
        return res.send({ error: '<div class="alert alert-warning" role="alert">User not found</div>' })

    if (!await bcrypt.compare(password, user.password))
        return res.send({ error: '<div class="alert alert-danger" role="alert">Invalid password</div>' })

    user.password = undefined
    res.send({
        user,
        token: generateToken({ id: user._id })
    })


})

router.get('/login', (req, res) => {
    res.render('./templates/login.html')
})

router.post('/forgot_password', async (req, res) => {
    const { email } = req.body

    try {
        const user = await User.findOne({ email })

        if (!user)
            return res.status(400).send({ error: 'User not found' })

        const token = crypto.randomBytes(20).toString('hex')

        const now = new Date()
        now.setHours(now.getHours() + 1)

        await User.findOneAndUpdate({ email }, {
            '$set': {
                passwordResetToken: token,
                passwordResetExpires: now
            }
        })

        mailer.sendMail({
            to: email,
            from: 'eduardo.yugan@gmail.com',
            template: 'forgot_password',
            context: { token }
        }, (err) => {
            if (err) {
                console.log(err)
                res.status(400).send({ error: 'Cannot send forgot password email' })
            }
            console.log(user.email)
            res.send()
        })
    } catch (error) {
        res.status(400).send({ error: 'Error on forgot password, try again' })
    }
})

router.get('/forgot_password', (req, res) => {
    res.render('./templates/forgot_password.html')
})

router.post('/reset_password', async (req, res) => {
    const { email, token, password } = req.body

    try {
        const user = await User.findOne({ email })
            .select('+passwordResetToken passwordResetExpires')

        if (!user)
            return res.status(400).send({ error: 'User not found' })

        if (token !== user.passwordResetToken)
            return res.status(400).send({ error: 'Token invalid' })

        const now = new Date()

        if (now > user.passwordResetExpires)
            return res.status(400).send({ error: 'Token expired, generate a new one' })

        user.password = password

        await user.save()

        res.send()

    } catch (err) {
        res.status(400).send({ error: 'Cannot reset password, try again' })
    }
})

router.get('/users', async (req, res) => {
    const users = await User.find()
    res.send(users)
    // res.render('home.html')
})

module.exports = app => app.use('/', router)