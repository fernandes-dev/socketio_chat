const express = require('express')

const router = express.Router()

router.get('/', (req, res) => {
    res.render('../../index.html')
})

router.post('/home', (req, res) => {

    const { auth } = req.body
    try {
        if (!auth)
            res.send({ error: 'Page not found' })
        res.render('./templates/home.html')
    } catch (error) {
        res.send({ err: error })
    }
})

module.exports = app => app.use('/', router)