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
      <div class="singleMessage">
        <h3 class="name">
          ${data.userName}
        </h3>
        <div> 
          <div class="message">
            ${data.content}
          </div>
          <input type="button" onclick="likeMessage(messageCache[${idx}])" value="${data.likedBy.length} Likes" class="likes-count">
        </div>
      </div>
    `);
  }).join(' ');

  document.querySelector('#messages').innerHTML = html;
}

submitBtn.onclick = function(e) {
  e.preventDefault();

  var payload = {
    messageId: randomId(),
    userName: document.querySelector('#username').value,
    content: document.querySelector('#message').value,
    likedBy: [],
    ts: Date.now().toString()
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
