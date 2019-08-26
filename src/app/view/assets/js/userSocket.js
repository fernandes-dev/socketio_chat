
let host = 'http://localhost:3333'

if (location.hostname !== "localhost") {
    host = 'https://sn-socket.herokuapp.com/'
}

let socket = io(host)


function addZero(i) {
    if (i < 10) {
        i = "0" + i;
    }
    return i;
}

function time() {
    let date = new Date()
    let time = {
        hora: addZero(date.getHours()),
        minuto: date.getMinutes(),
        dia: addZero(date.getDay()),
        mes: addZero(date.getMonth()),
        ano: date.getFullYear()
    }
    return time
}

function renderMyMessage(message) {
    let name = message.author.substr(0, 1)
    let firstname = message.author.split(' ')
    $('#messages').append(`
    <div id="group_message">
        <div class="mymessage_content d-flex justify-content-end">
            <div class="mymessage">${message.message}</div>
            <div class="myprofile">${name}</div>
        </div>
        <div class="mymessage_content d-flex justify-content-end">
            <span id="myname_short">${firstname[0]} - ${time().hora}:${time().minuto}h - ${time().dia}-${time().mes}-${time().ano}</span>
        </div>
    </div>
    `)
}

function renderOtherMessage(message) {
    let name = message.author.substr(0, 1)
    let firstname = message.author.split(' ')
    $('#messages').append(`
    <div class="message_content d-flex justify-content-start">
        <div class="profile">${name}</div>
        <div class="message">${message.message}</div>
    </div>
    <span id="name_short">${firstname} - ${time().hora}:${time().minuto}h - ${time().dia}-${time().mes}-${time().ano}</span>
    `)
}

socket.on('previousMessage', function (messages) {
    // console.log(messages)
    messages.forEach(message => {
        if (message.author !== localStorage.getItem('name')) {
            renderOtherMessage(message)
        } else {
            renderMyMessage(message)
        }
    })
})

socket.on('receivedMessage', function (message) {
    renderOtherMessage(message)
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
    renderMyMessage(messageObject)
    $('input[name=message]').val('')
})