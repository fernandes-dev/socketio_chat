const path = require('path')
const nodemailer = require('nodemailer')
const hbs = require('nodemailer-express-handlebars')
const os = require('os')

// const { host, port, user, pass } = require('../config/mail.json')
let host = process.env.HOST_TRAP,
    port = process.env.PORT_TRAP,
    user = process.env.USER_TRAP, pass = process.env.PASS_TRAP,
    transport = ''

if (os.hostname() === 'EDUARDO') {
    transport = nodemailer.createTransport({
        host,
        port,
        auth: { user, pass }
    })
} else {
    transport = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: process.env.HOST_VEDAS,
            pass: process.env.PASS_VEDAS
        }
    })
}

transport.use('compile', hbs({
    viewEngine: {
        extName: '.html',
        partialsDir: 'src/resources/mail',
        layoutsDir: 'src/resources/mail',
        defaultLayout: 'forgot_password.html',
    },
    viewPath: path.resolve('./src/resources/mail'),
    extName: '.html'
}))

module.exports = transport