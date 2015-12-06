var socket = io();

socket.on('connect', function () {
    console.log('Connected to the Socket.io server.');
});

socket.on('message', function (message) {
    var momentTimestamp = moment.utc(message.timestamp);

    $('#messages').append('<p><strong>' + momentTimestamp.local().format('h:mm a') + ':</strong> ' + message.text + '</p>');
});

var $form = $('#message-form');

$form.on('submit', function(event) {
    var messageBox = $form.find('input[name="message"]');

    socket.emit('message', {
        text: messageBox.val()
    });

    messageBox.val('');

    event.preventDefault();
});