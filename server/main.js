var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var express = require('express');
var app = express();
var server = require('http').Server(app);
var session = require('express-session')

var io = require('socket.io')(server);

var Comment = require('./mongooseConfig').Comment;
var User = require('./mongooseConfig').User;

app.use(express.static('app'));
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

//-------passport section------------------
passport.use(new LocalStrategy(function (username, password, done) {
  console.log(username, password);
  User.findOne({
    name: username,
    password: password
  }, function (err, user) {
    if (err) {
      return done(err);
    }
    if (!user) {
      return done(null, false);
    }
    return done(null, user);
  });
}));

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
    done(err, user);
});

app.post('/login', passport.authenticate('local'), function (req, res) {
  res.send(req.user);
});
//---------passport section end-------------------

//---------socketIO section-----------------------
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
    // var message = messages.filter(function (message) {
    //   return message.messageId == data.messageId
    // })[0];

    // message.likedBy = data.likedBy;
    // console.info('Updated message: ' + message.content);
    // io.sockets.emit('messages', messages);
  });

});
//---------socketIO section end-----------------------


server.listen(3000, function () {
  console.log('Server is listening on port 3000');
});