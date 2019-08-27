const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const app = express()
const path = require('path')
const server = require('http').createServer(app)
const io = require('socket.io')(server)
const compress = require('compression')

require('dotenv').config({
    path: process.env.NODE_ENV === 'test' ? '.test.env' : '.env'
})

console.log(process.env.APP_NAME)

app.use(compress())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors())

app.use(express.static(path.join(__dirname, 'app/view')))
app.set('views', path.join(__dirname, 'app/view'))
app.engine('html', require('ejs').renderFile)
app.set('view engine', 'html')

require('./app/controllers/index')(app)

const messages = []
const users = []
const usersComplete = []



io.on('connection', socket => {
    console.log(`Socket conectado: ${socket.client.id}`)

    socket.emit('connected', users)

    socket.emit('previousMessage', messages)

    socket.on('conn', dados => {
        if (users.indexOf(dados) <= -1) {
            users.push(dados)
        }
        socket.broadcast.emit('connected', users)
        console.log('usuario: ' + users)
        
    })

    socket.on('disconnected', dados => {
        if (users.indexOf(dados) >= 0) {
            users.splice(users.indexOf(dados), 1)
            console.log('Dados removidos:   ' + dados+' -- Usuarios atuais: '+users)
            socket.broadcast.emit('disconnectedd', dados)
        } else {
            socket.emit('disconnectedd', users.indexOf(dados))
        }
    })

    socket.on('sendMessage', data => {
        messages.push(data)

        socket.broadcast.emit('receivedMessage', data)
    })

    socket.on('disconnect', (reason) => {
        console.log(reason)
      })

})

server.listen(process.env.PORT || 3333)