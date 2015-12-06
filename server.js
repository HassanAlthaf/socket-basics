var PORT = process.env.PORT || 3000;
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var moment = require('moment');

app.use(express.static(__dirname + '/public'));

var clientInfo = {};

io.on('connection', function (socket) {
    console.log('User connected via Socket.io!');

    socket.on('joinRoom', function(request) {
        clientInfo[socket.id] = request;
        socket.join(request.room);

        socket.broadcast.to(request.room).emit('message', {
            name: 'System',
            text: request.name + ' has joined!',
            timestamp: moment.valueOf()
        })
    });

    socket.on('message', function (message) {
        message.timestamp = moment().valueOf();
        console.log('Message: ' + message.text);

        io.to(clientInfo[socket.id].room).emit('message', message);
    });

    socket.emit('message', {
        name: 'System',
        text: 'Welcome to the Chat Application!',
        timestamp: moment().valueOf()
    });
});

http.listen(PORT, function () {
    console.log('Server started listening on port ' + PORT + '!');
});