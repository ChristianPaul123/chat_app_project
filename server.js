const express = require("express");
const app = express();
const path = require("path");

const server = require("http").createServer(app);

const port = 8000;

let socketsConected = new Set()

// set the view engine to ejs
app.set('view engine', 'ejs');

//picture in server using express
app.use(express.static(path.join(__dirname+"/public")));

// index page
app.get('/', function(req, res) {
  res.render('pages/index');
});

const io = require("socket.io")(server);


io.on("connection",function(socket){
  socket.on("newuser",function(username){
      socket.broadcast.emit("update", username + " joined the convo")
      console.log('Socket connected', socket.id)
      socketsConected.add(socket.id)
      io.emit('clients-total', socketsConected.size)
  });
  
  socket.on("exituser",function(username){
    socket.broadcast.emit("update", username + " left the convo")
    console.log('Socket exited', socket.id)
    socketsConected.delete(socket.id)
    io.emit('clients-total', socketsConected.size)
  });

  socket.on("disconnect",function(username) {
    socket.broadcast.emit("update", username + " got disconnected in the convo")
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
})