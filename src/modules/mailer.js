const path = require('path')
const nodemailer = require('nodemailer')
const hbs = require('nodemailer-express-handlebars')

const { host, port, user, pass } = require('../config/mail.json')

// const transport = nodemailer.createTransport({
//     host,
//     port,
//     auth: { user, pass }
// })
const transport = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'naorespondavedassistemas@gmail.com',
        pass: 'vedas001001'
    }
})

transport.use('compile', hbs({
    viewEngine: {
        extName: '.html',
        partialsDir: 'resources/mail',
        layoutsDir: 'resources/mail',
        defaultLayout: 'forgot_password.html',
    },
    viewPath: path.resolve('./resources/mail'),
    extName: '.html'
}))

module.exports = transport