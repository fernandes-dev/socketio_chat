const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const app = express()
const path = require('path')
const server = require('http').createServer(app)
const io = require('socket.io')(server)

require('dotenv').config({
    path: process.env.NODE_ENV === 'test' ? '.test.env' : '.env'
})

console.log(process.env.APP_NAME)

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors())

app.use(express.static(path.join(__dirname, 'app/view')))
app.set('views', path.join(__dirname, 'app/view'))
app.engine('html', require('ejs').renderFile)
app.set('view engine', 'html')

require('./app/controllers/index')(app)

let messages = []

io.on('connection', socket => {
    console.log(`Socket conectado: ${socket.id}`)

    socket.emit('previousMessage', messages)

    socket.on('sendMessage', data => {
        messages.push(data)

        socket.broadcast.emit('receivedMessage', data)
    })
})

server.listen(process.env.PORT || 3333)