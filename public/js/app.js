var socket = io();

socket.on('connect', function () {
    console.log('Connected to the Socket.io server.');
});

socket.on('message', function (message) {
     console.log(message.text);
});