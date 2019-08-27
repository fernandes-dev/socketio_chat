const jwt = require('jsonwebtoken')

module.exports = (req, res, next) => {

    let authHeader = (req.headers.cookie || '').split(';')

    if (!authHeader[0].length) {
        // return res.status(401).send({ error: 'No token provided' })
        res.redirect('/')
    }

    authHeader = authHeader.filter(v => v.includes('Bearer'))[0].split('=')[1]

    jwt.verify(authHeader, process.env.SECRET, (err, decoded) => {
        if (err) {
            // res.redirect('/')
            return res.status(401).send({ error: 'Token invalid', token: authHeader })
        }

        return next()
    })
}