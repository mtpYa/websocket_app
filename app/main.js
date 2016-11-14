var userId = localStorage.getItem('userId') || randomId();
localStorage.setItem('userId', userId);
var messageCache;
console.info('Hello, I am user #' + userId);

function randomId() {
  return Math.floor(Math.random() * 1e11);
}

var socket = io.connect('http://localhost:3000', {
      'forceNew': true
});
var submitBtn = document.querySelector('.sendMessageButton');
var likeBtn = document.querySelector('.likes-count');

socket.on('messages', function(data) {
  console.info(data);
  messageCache = data;
  render(); 
});

function render() {
  var data = messageCache;
  var html = data.map(function(data, idx) {
    return (`
      <div class="name">
        ${data.userName}
      </div> 
      <a href=${data.content.link} class="message" target=blank>
        ${data.content.text}
      </a>
      <input type="button" onclick="likeMessage(messageCache[${idx}])" value="${data.likedBy.length} Likes" class="likes-count">
      `);
  }).join(' ');

  document.querySelector('#messages').innerHTML = html;
}

submitBtn.onclick = function(e) {
  e.preventDefault();

  var payload = {
    messageId: randomId(),
    userName: document.querySelector('#username').value,
    content: {
      text: document.querySelector('#message').value,
      link: document.querySelector('#linkAddress').value
    },
    likedBy: [],
    ts: Date.now()
  };

  socket.emit('new-message', payload);
}

function likeMessage(message) {
  var index = message.likedBy.indexOf(userId);

  if(index < 0) {
    message.likedBy.push(userId);
  } else {
    message.likedBy.splice(index, 1);
  }

  socket.emit('update-message', message);
  render();

  return false;
}
