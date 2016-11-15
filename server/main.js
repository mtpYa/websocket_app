var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var Comment = require('./mongooseConfig');

app.use(express.static('app'));

io.on('connection', function (socket) {
  console.log('Connection to Socket.io established');

  Comment.find({}, function (err, comments) {
    if (err) {
      res.send(err);
    }
    socket.emit('messages', comments);
  });

  socket.on('new-message', function (data) {
    var newComment = new Comment(data);

    newComment.save(function (err, savedComment) {
      if (err) {
        res.send(err);
      }

      Comment.find({}, function (err, comments) {
        if (err) {
          res.send(err);
        }
        io.sockets.emit('messages', comments);
      });
    });
  });

  socket.on('update-message', function (data) {
    var message = messages.filter(function (message) {
      return message.messageId == data.messageId
    })[0];

    message.likedBy = data.likedBy;
    console.info('Updated message: ' + message.content);
    io.sockets.emit('messages', messages);
  });

});


server.listen(3000, function () {
  console.log('Server is listening on port 3000');
});