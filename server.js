var PORT = process.env.PORT || 3000;
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var moment = require('moment');

app.use(express.static(__dirname + '/public'));

var clientInfo = {};

function sendCurrentUsers (socket) {
    var info = clientInfo[socket.id];
    var users = [];

    if (typeof info === 'undefined') {
        return;
    }

    Object.keys(clientInfo).forEach(function (socketId) {
        var userInfo = clientInfo[socketId];

        if (info.room === userInfo.room) {
            users.push(userInfo.name);
        }
    });

    socket.emit('message', {
        name: 'System',
        text: 'Current users: ' + users.join(', '),
        timestamp: moment().valueOf()
    });
}

io.on('connection', function (socket) {
    console.log('User connected via Socket.io!');

    socket.on('disconnect', function () {
        var userData = clientInfo[socket.id];

        if (typeof userData !== 'undefined') {

            io.to(userData.room).emit('message', {
                name: 'System',
                text: userData.name + ' has left!',
                timestamp: moment().valueOf()
            });

            socket.leave(userData.room);
            delete clientInfo[socket.id];
        }
    });

    socket.on('joinRoom', function(request) {
        clientInfo[socket.id] = request;
        socket.join(request.room);

        socket.broadcast.to(request.room).emit('message', {
            name: 'System',
            text: request.name + ' has joined!',
            timestamp: moment().valueOf()
        })
    });

    socket.on('message', function (message) {
        console.log('Message: ' + message.text);

        if (message.text === "@currentUsers") {
            sendCurrentUsers(socket);
        } else {
            message.timestamp = moment().valueOf();
            io.to(clientInfo[socket.id].room).emit('message', message);
        }
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