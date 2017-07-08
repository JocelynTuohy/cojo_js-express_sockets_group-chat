const express = require('express');
const path = require('path');
const app = express();
const PORT  = 8000;

app.use(express.static(path.join(__dirname, './client')));
app.use(express.static(path.join(__dirname, './node_modules/jquery/dist')));

const server = app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});

const io = require('socket.io').listen(server);

var chatters = {};
var messages = [];

io.sockets.on("connection", (socket) => {
  console.log("New connection", socket.id);
  socket.emit("askname");
  
  socket.on("new_chatter", (name) => {
    if (!name){
      socket.emit("askname");
    }else{
      messages.push({
        name: "<strong>Moderator</strong>:",
        message: `${name} has entered the chat room.`,
        time: new Date()
      })
      id = socket.id;
      chatters[id] = name;
      io.emit("update", messages);
    }
  });

  socket.on("new_msg", (info) => {
    // console.log('is the new message going anywhere?');
    // console.log(info.name, info.message);
    messages.push({
      name: `${info.name}:`,
      message: info.message,
      time: new Date()
    });
    io.emit("update", messages);
  });

  socket.on("disconnect", () => {
    // console.log(socket.id);
    this_name = chatters[socket.id];
    // console.log(this_name);
    messages.push({
      name: "<strong>Moderator:</strong>",
      message: `${this_name} has left the chat room.`,
      time: new Date()
    })
    io.emit("update", messages);
  });

});