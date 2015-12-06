var socket = io();

socket.on('connect', function () {
    console.log('Connected to the Socket.io server.');
});

socket.on('message', function (message) {
     console.log(message.text);
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