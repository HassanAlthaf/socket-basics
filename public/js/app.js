var name = getQueryVariable('name') || 'Anonymous';
var room = getQueryVariable('room');
console.log(name + ' joined ' + room);
$('.room-title').html(room);

var socket = io();

socket.on('connect', function () {
    console.log('Connected to the Socket.io server.');

    socket.emit('joinRoom', {
        name: name,
        room: room
    });
});

socket.on('message', function (message) {
    var momentTimestamp = moment.utc(message.timestamp);
    var $messages = $('#messages');

    $messages.append('<p><strong>' + message.name + ' ' + momentTimestamp.local().format('h:mm a') + '</strong></p>');
    $messages.append('<p>' + message.text + '</p>');
});

var $form = $('#message-form');

$form.on('submit', function(event) {
    var messageBox = $form.find('input[name="message"]');

    socket.emit('message', {
        name: name,
        text: messageBox.val()
    });

    messageBox.val('');

    event.preventDefault();
});