const express = require('express')
const authMiddleware = require('../middlewares/auth')

const router = express.Router()

router.use(authMiddleware)


router.get('/chat', (req, res) => {
    res.render('auth/chat.html')
})

module.exports = app => app.use('/auth', router)