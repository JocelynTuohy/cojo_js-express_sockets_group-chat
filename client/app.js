$(document).ready(() => {
  // console.log('The document is ready.');

  const socket = io.connect();
  var name;

  $('#messages').on('click', 'button', () => {
      let message = $('#message').val();
      // console.log(message);
      socket.emit('new_msg', {name: name, message: message});
  });

  socket.on("askname", () => {
    // console.log("asking for a name");
    name = prompt("Your name:");
    // console.log(name)
    socket.emit("new_chatter", name);
  });

  socket.on("update", (messages) => {
    let messageString = "<table><tbody>"
    for (let i = 0; i < messages.length; ++i){
      messageString += `<tr><td>${messages[i].name}</td>`
      messageString += `<td>${messages[i].message}</td></tr>`
    }
    messageString += "</tbody></table>"
    let formString = '<input id="message" type="text" placeholder="enter your message here">' +
    '</input><button type="button" id="messagebutton">Send</button>';
    messageString += formString;
    $('#messages').html(messageString);
  });

});
