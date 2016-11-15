var mongoose = require('mongoose').set('debug', true);;

var options = {
  server: {
    socketOptions: {
      keepAlive: 300000,
      connectTimeoutMS: 30000
    }
  },
  replset: {
    socketOptions: {
      keepAlive: 300000,
      connectTimeoutMS: 30000
    }
  }
};

var mongodbUri = 'mongodb://socketUser:socketPassword@ds061196.mlab.com:61196/socket_app';

mongoose.connect(mongodbUri, options);

var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));

var commentSchema = mongoose.Schema({
  messageId: Number,
  userName: String,
  content: String,
  likedBy: Array,
  ts: String
});

var userSchema = mongoose.Schema({
  name: String,
  password: String
});

var Comment = mongoose.model('Comment', commentSchema);
var User = mongoose.model('User', userSchema);

module.exports = {
  Comment,
  User
}