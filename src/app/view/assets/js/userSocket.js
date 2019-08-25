const host = 'http://localhost:3333'

let socket = io('http://localhost:3333')

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