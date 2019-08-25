
let host = 'http://localhost:3333'

if (location.hostname !== "localhost") {
    host = 'https://realtime-chat-node.herokuapp.com/'
}

let socket = io(host)

function renderMessage(message) {
    $('#messages').append('<div class="message"><strong>' + message.author + '</strong>: ' + message.message + '</div>')
}

socket.on('previousMessage', function (messages) {
    messages.forEach(message => {
        renderMessage(message)
    })
})

socket.on('receivedMessage', function (message) {
    renderMessage(message)
})

$('#send_message').submit(function (event) {
    event.preventDefault()

    let author = $('input[name=name]').val()
    let message = $('input[name=message]').val()

    let messageObject = {
        author,
        message
    }

    console.log(messageObject)
    socket.emit('sendMessage', messageObject)
    renderMessage(messageObject)
    $('input[name=message]').val('')
})