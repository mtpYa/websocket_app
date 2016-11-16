var currentUser = {};

var socket = io.connect('http://localhost:3000', {
  'forceNew': true
});
var submitBtn = document.querySelector('.sendMessageButton');
var likeBtn = document.querySelector('.likes-count');
var userNameInput = document.querySelector('.userName');
var userPassInput = document.querySelector('.userPassword');
var loginSubmit = document.querySelector('.loginSubmit');
var logoutSubmit = document.querySelector('.logoutSubmit');
var messageContainer = document.querySelector('.loginMessage');

socket.on('messages', function (data) {
  console.info(data);
  messageCache = data;
  render();
});

function render() {
  var data = messageCache;
  var html = data.map(function (data, idx) {
    return (`
      <div class="singleMessage">
        <h3 class="name">
          ${data.userName}
        </h3>
        <div> 
          <div class="message">
            ${data.content}
          </div>
          <input type="button" onclick="likeMessage('${data._id}')" value="${data.likedBy.length} Likes" class="likes-count">
        </div>
      </div>
    `);
  }).join(' ');

  document.querySelector('#messages').innerHTML = html;
}

submitBtn.onclick = function (e) {
  e.preventDefault();

  if (currentUser.name) {
    var payload = {
      userName: document.querySelector('#username').value,
      content: document.querySelector('#message').value,
      likedBy: [],
      ts: Date.now().toString()
    };

    socket.emit('new-message', payload);
  }
};

loginSubmit.onclick = function (e) {
  e.preventDefault();

  $.post('/login', {
      username: userNameInput.value,
      password: userPassInput.value
    })
    .done(function (data) {
      currentUser = data;
      showMessage(`You are logged as ${data.name}`);
      logoutSubmit.disabled = false;
      loginSubmit.disabled = true;
      userNameInput.value = '';
      userPassInput.value = ''
    })
};

logoutSubmit.onclick = function (e) {
  e.preventDefault();

  $.get('/logout')
    .done(function () {
      currentUser = {};
      showMessage(' ');
      logoutSubmit.disabled = true;
      loginSubmit.disabled = false;
    })
};

function likeMessage(messageId) {
  socket.emit('update-message', {
    messageId: messageId,
    userId: currentUser._id
  });

  return false;
}

function showMessage(msg) {
  messageContainer.innerHTML = msg;
  // setTimeout(function () {
  //   messageContainer.innerHTML = '';
  // }, 1000);
}