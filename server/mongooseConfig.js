var mongoose = require('mongoose');

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

var Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;