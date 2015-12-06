var PORT = process.env.PORT || 3000;
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(express.static(__dirname + '/public'));

io.on('connection', function (socket) {
    console.log('User connected via Socket.io!');

    socket.on('message', function (message) {
        console.log(message.text);

        socket.broadcast.emit('message', message);
    });

    socket.emit('message', {
        text: 'Welcome to the Chat Application!'
    });
});

http.listen(PORT, function () {
    console.log('Server started listening on port ' + PORT + '!');
});