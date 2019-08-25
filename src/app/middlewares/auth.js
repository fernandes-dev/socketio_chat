const jwt = require('jsonwebtoken')
const authConfig = require('../../config/auth.json')

module.exports = (req, res, next) => {

    let authHeader = (req.headers.cookie || '').split(';')

    if (!authHeader[0].length)
        return res.status(401).send({ error: 'No token provided' })

    authHeader = authHeader.filter(v => v.includes('Bearer'))[0].split('=')[1]

    jwt.verify(authHeader, authConfig.secret, (err, decoded) => {
        if (err) return res.status(401).send({ error: 'Token invalid', token: authHeader })

        return next()
    })
}