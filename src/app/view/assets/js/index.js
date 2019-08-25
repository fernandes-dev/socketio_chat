
let homeUrl = ''
let loginUrl = ''
let registerUrl = ''
let chatUrl = ''
let forgot = ''
if (location.hostname === "localhost") {
    homeUrl = 'http://localhost:3333/home'
    loginUrl = 'http://localhost:3333/login'
    registerUrl = 'http://localhost:3333/register'
    chatUrl = 'http://localhost:3333/auth/chat'
    forgot = 'http://localhost:3333/forgot_password'
} else {
    homeUrl = 'https://realtime-chat-node.herokuapp.com/home'
    loginUrl = 'https://realtime-chat-node.herokuapp.com/login'
    registerUrl = 'https://realtime-chat-node.herokuapp.com/register'
    chatUrl = 'https://realtime-chat-node.herokuapp.com/auth/chat'
    forgot = 'https://realtime-chat-node.herokuapp.com/forgot_password'
}

function loadNav(page) {
    if (page === 'chat') {
        $("#container").load('../templates/navChat.html')
    } else {
        $("#container").load('../templates/nav.html')
    }
}

function sendAlert(message) {
    $('#status').html(message)
}

function sendForm(form) {
    $(form).submit(function (event) {
        event.preventDefault()
        let dados = $(this).serialize()
        if (form === '#register') {
            console.log('Register')
            axios({
                method: 'post',
                url: registerUrl,
                data: dados
            }).then(function (response) {
                console.log(response)
                sendAlert(response.data.message)
                document.getElementById('register').reset()
            }).catch(function (error) {
                console.log(error)
            })
        } else if (form === '#login') {
            console.log('Login')
            axios({
                method: 'post',
                url: loginUrl,
                data: dados
            }).then(function (response) {
                // console.log(response.data.user.name)
                if (response.data.user) {
                    localStorage.setItem('name', response.data.user.name)
                    let token = response.data.token
                    document.cookie = `Bearer=${token}`
                    document.location.replace(chatUrl)
                } else {
                    sendAlert(response.data.error)
                }

            }).catch(function (error) {
                console.log(error)
            })
        } else if (form === '#forgot_password') {
            axios({
                method: 'post',
                url: loginUrl,
                data: dados
            }).then(function (response) {
                console.log(response)
            }).catch(function (error) {
                console.log(error)
            })
        }
    })
}

function go(url, form = 0) {
    axios({
        method: 'get',
        url: url,
        dataType: 'html'
    }).then(function (response) {
        // console.log(response)
        document.getElementById('container').innerHTML = response.data
        if (form)
            sendForm(form)
        $('div label').addClass('font-weight-bold')
        $('#form_content').addClass('col-sm-6 col-md-6 col-lg-4')
        if (url === loginUrl)
            document.getElementById('forgot').addEventListener('click', () => go(forgot, '#forgot_password'))
        // console.log('loginnnn')
    }).catch(function (error) {
        console.log(error)
    })
}

function verifyHost() {
    if (location.hostname === "localhost")
        console.log('Host atual: ' + location.hostname)
}

$(document).ready(function () {
    $("#nav").load('../templates/nav.html', function () {
        document.getElementById('homelink').addEventListener('click', () => go(homeUrl))
        document.getElementById('registerlink').addEventListener('click', () => go(registerUrl, '#register'))
        document.getElementById('loginlink').addEventListener('click', () => { go(loginUrl, '#login') })
    })
    $("#container").load('../templates/home.html')
    function updateOnlineStatus() {
        let condition = navigator.onLine ? "ONLINE" : "OFFLINE";
        console.log(condition)
    }
    const user = localStorage.getItem('name')
    $('#name').val(user)
    updateOnlineStatus()
    verifyHost()
})