const express = require('express')

const router = express.Router()

router.get('/', (req, res) => {
    res.render('index.html')
})

router.get('/home', (req, res) => {
    res.render('./templates/home.html')
})

module.exports = app => app.use('/', router)