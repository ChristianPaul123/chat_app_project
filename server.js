const express = require("express");
const app = express();
const path = require("path");

const server = require("http").createServer(app);
const io = require("socket.io")(server);

const port = 9000;

let socketsConected = new Set()

// set the view engine to ejs
app.set('view engine', 'ejs');

//public in server using express
app.use(express.static(path.join(__dirname+"/public")));

// login page
app.get('/', function(req, res) {
  res.render('pages/login');
});

//index page
app.get('/index', function(req, res) {
  res.render('pages/index');
});





io.on("connection",function(socket){

  socket.on("newuser",function(username){
     socket.username = username;
      socket.broadcast.emit("update",  socket.username + " joined the convo")
      console.log('Socket connected', socket.id)
      socketsConected.add(socket.id)
      io.emit('clients-total', socketsConected.size)
  })


  socket.on("exituser",function(username){
    socket.broadcast.emit("update", username + " left the convo")
    console.log('Socket exited', socket.id)
    socketsConected.delete(socket.id)
    io.emit('clients-total', socketsConected.size)
  });

  socket.on("disconnect",function(username) {
    username = socket.username;
    io.emit("update", username + " got disconnected in the convo")
    console.log('Socket disconnected', socket.id)
   socketsConected.delete(socket.id)
    io.emit('clients-total', socketsConected.size)
  });

  

  socket.on('message', (data) => {
    socket.broadcast.emit('chat-message', data)
  });

  socket.on("chat",function(message){
    socket.broadcast.emit("chat", message);
  });


});

server.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});