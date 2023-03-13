const chatForm = document.getElementById('chat-form')
const chatMessages = document.querySelector('.messages')
const roomName = document.querySelector('.room-name')
const usersDOMSelect = document.querySelector('.usersList')
const btnLeave = document.querySelector('.leave')

// get username and room from URL
const { username, room } = Qs.parse(location.search, {
    ignoreQueryPrefix: true
})

console.log(username, room)

const socket = io();


// Join chatroom
socket.emit('joinRoom', { username, room })


// get room and users
socket.on('roomUsers', ({ room, users }) => {
    outputRoomName(room)
    outputUsers(users)
})

function scrollBottomAlways() {
    if (chatMessages.lastElementChild) {
        chatMessages.lastElementChild.scrollIntoView();
    }
    console.log(chatMessages.lastElementChild);
}


// Message from server (always then sen d amessage, this is invoked)
socket.on('message', (message, who) => {
    console.log(message, who)
    outputMessage(message, who)


    // [test] - emit: send to server.
    socket.emit('test', 'luci')

    // Scroll down
    scrollBottomAlways()
})

// message submit
chatForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // get msg txt
    const msg = e.target.elements.msg.value;

    // Emit message to server
    socket.emit('chatMessage', msg)

    // clear input
    e.target.elements.msg.value = ''
    e.target.elements.msg.focus()

})

// leave room
btnLeave.addEventListener('click', (e) => {
    window.location.href = '/'
})


// output message to DOM
function outputMessage(message, who) {
    const li = document.createElement('li')
    li.className = 'msg-c'
    li.classList.add('message')
    li.innerHTML = `
    <div class="user">${message.username} às <span>${message.time}</span> </div>
    <div class="msg">${message.text}</div>
    `;

    chatMessages.appendChild(li)

}

// add room name to DOM
function outputRoomName(room) {
    roomName.innerHTML = room;
}

// add users to DOM
function outputUsers(users) {
    console.log(users)
    usersDOMSelect.innerHTML = `
    ${users.map(user => `<li>🦝 ${user.username}</li>`).join('')}`;
}