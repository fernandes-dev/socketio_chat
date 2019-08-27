
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

function scrolDown() {
    $('#messages').animate({
        scrollTop: $(this).height() * 500
    }, 100)
}

function color(name) {
    let array = []
    const myclass = personal()
    const arrayCor = Object.keys(myclass).map(function (key) {
        return [key, myclass[key]]
    })

    arrayCor.forEach(cor => {
        if (cor[0] === name)
            array.push(cor[1])
    })
    return array
}

function personal() {
    const corObj = {
        A: '#1981CD', B: '#900020', C: '#DC143C', D: '#778899', E: '#6C3082', F: '#A2006D', G: '#Be5b59', H: '#2E8B57', I: '#5A4FCF', J: '#00A86B', K: '#8EE53F', L: '#FF8C00', M: '#8B008B', N: '#000080', O: '#9932CC', P: '#9370DB', Q: '#51484F', R: '#FF007F', S: '#FA7F72', T: '#B22222', U: '#EC2300', V: '#006400', W: '#008080', X: '	#738678', Y: '#0014A8', Z: '#9400D3'
    }
    return corObj
}

// antigo render my message
// function renderMyMessage(message) {
//     scrolDown()
//     const name = message.author.substr(0, 1)
//     const firstname = message.author.split(' ')
//     $('#messages').append(`
//     <div class="group_message${name}">
//         <div class="mymessage_content d-flex justify-content-end">
//             <div class="mymessage">${message.message}</div>
//             <div style="background-color: ${color(name)};" class="myprofile">${name}</div>
//         </div>
//         <div class="mymessage_content d-flex justify-content-end">
//             <span id="myname_short">${firstname[0]} - ${message.time}h - ${message.date}</span>
//         </div>
//     </div>
//     `)
// }
// antigo render my message

function togleClass(seconds) {
    console.log(seconds)
    document.getElementById(`${seconds}`).addEventListener('click', function () {
        $(`#show${seconds}`).toggleClass('hide')
    })
}

function renderMyMessage(message) {
    scrolDown()
    const firstname = message.author.split(' ')
    $('#messages').append(`
    <div class="group_message">
        <div class="mymessage_content d-flex justify-content-end">
            <div id="${message.seconds}" class="mymessage">${message.message}</div>
        </div>
        <div id="show${message.seconds}" class="hide mymessage_content d-flex justify-content-end">
            <span id="myname_short">${message.time} - ${message.date}</span>
        </div>
    </div>
    `)
    togleClass(message.seconds)
}

function renderOtherMessage(message) {
    // scrolDown()
    let firstname = message.author.split(' ')
    $('#messages').append(`
    <div class="message_content d-flex justify-content-start">
        <div id="${message.seconds}" class="message">${message.message}</div>
    </div>
    <div>
        <span id="name_short">${firstname[0]}</span>
        <span id="show${message.seconds}" class="hide hour"> - ${message.time}h - ${message.date}</span>
    </div>
    `)
    togleClass(message.seconds)
}

socket.on('connected', function (users) {
    users.forEach(user => {
        const myName = document.getElementById('name').value
        if (myName !== user) {
            const initial = user.substr(0, 1)
            const firstname = user.split(' ')

            if (!document.getElementById(`user_name${user}`)) {
                console.log('My Name: ' + myName)
                console.log('User: ' + user)
                $('#users').append(`
                <div class="user_contact user on${user}">
                    <div class="row text-light">
                        <div style="background-color: ${color(initial)};" class="myprofile">${initial}</div>
                        <div id="user_name${user}" class="user_name">${firstname[0]}</div>
                    </div>
                </div>
                `)
            } else {
                // console.log('Falha ao verificar usuarios online')
            }
        }
    })
})

socket.on('previousMessage', function (messages) {
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

socket.on('disconnectedd', function (user) {
    console.log(user)
    $(`.on${user}`).remove()
})

$('#logout').click(function () {
    document.cookie = "Bearer=asd; expires=Thu, 18 Dec 2013 12:00:00 UTC; path=/";
    const myName = document.getElementById('name').value
    socket.emit('disconnected', myName)
    location.href = host
})

$('#send_form').click(function (event) {
    event.preventDefault()

    let author = $('input[name=name]').val()
    let message = $('input[name=message]').val()

    let date = new Date()
    let stamp = {
        time: `${addZero(date.getHours())}:${addZero(date.getMinutes())}:${addZero(date.getSeconds())}`,
        date: `${addZero(date.getDay())}-${addZero(date.getMonth())}-${date.getFullYear()}`
    }

    let messageObject = {
        author,
        message,
        date: stamp.date,
        time: stamp.time,
        seconds: addZero(date.getSeconds())
    }

    socket.emit('sendMessage', messageObject)
    renderMyMessage(messageObject)
    $('input[name=message]').val('')
})

window.addEventListener("beforeunload", function (event) {
    const myName = document.getElementById('name').value
    socket.emit('disconnected', myName)
})

$(document).ready(function () {
    const user = document.getElementById('name').value
    socket.emit('conn', user)
})