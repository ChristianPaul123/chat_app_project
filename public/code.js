(function(){
  const clientsTotal = document.getElementById('client-total')

  //to add a sound
  const messageTone = new Audio('/chat_01.mp3')
  const clientTone = new Audio('/join_client.mp3')

 // to display the time sent using toLocalestring
  //var Time = new Date().toLocaleTimeString('en-PH', {
   // hour: 'numeric', minute: 'numeric', hour12: true
//}).replace(/([\d]+:[\d]{2})(:[\d]{2})(.*)/, "$1$3");

//hardcoded time display
    let today = new Date();
    let hours = today.getHours();
    let minutes = today.getMinutes();
    let ap = hours >= 12 ? 'pm' : 'am';
    let hours_ampm = hours % 12;
    let hoursampm = hours ? hours_ampm : 12;
    let minutesampm = minutes.toString().padStart(2, '0');
    let mergeTime = hours_ampm + ':' + minutesampm + ' ' + ap;


  const app = document.querySelector(".app");
  const socket = io();

  let uname = "";
  
  app.querySelector(".join-screen #join-user").addEventListener("click",function(){
    let username = app.querySelector(".join-screen #username").value;
    if(username.length == 0){
      alert("please put a username to continue")
      return;
    }


    socket.emit("newuser",username);
    uname = username;
    app.querySelector(".join-screen").classList.remove("active");
    app.querySelector(".chat-screen").classList.add("active");
    greetingFunction();

    socket.on('clients-total', (data) => {
      clientsTotal.innerText = `Total Clients: ${data}`
    })


  });

  app.querySelector(".chat-screen #send-message").addEventListener("click",function(){
    let message = app.querySelector(".chat-screen #message-input").value;
    if(message.length == 0){
      return;
    }
    renderMessage("my",{
      username:uname,
      text:message
    });
    socket.emit("chat",{
      username:uname,
      text:message
    });


    app.querySelector(".chat-screen #message-input").value = "";
  });

  

  app.querySelector(".chat-screen #exit-chat").addEventListener("click",function(){ 
    socket.emit("exituser", uname);
    window.location.href = window.location.href;
  });

  window.addEventListener('onoffline', function() {
    e.preventDefault(); 
    socket.emit("disconnect", uname);
    window.location.href = window.location.href;
  });

 


  socket.on("update",function(update){
  clientTone.play();
    renderMessage("update",update);
  });

  socket.on("chat",function(message){
    messageTone.play();
    renderMessage("other",message);
  });



  function greetingFunction() {
    alert("Hello " +"\""+ uname +"\"" + " have fun with the others");
  }


  function renderMessage(type,message){
    let messageContainer = app.querySelector(".chat-screen .messages");
    if(type == "my"){
      let el = document.createElement("div");
      let up = document.createElement("p")
        el.setAttribute("class","message my-message");
        up.setAttribute("class","message my-message");
        el.innerHTML = `
          <div>
              <div class="name">You</div>
              <div class="text">${message.text}</div>
          </div>
          `; 
          up.innerHTML = `<p>time sent:  ${mergeTime}</p>`;
          messageContainer.appendChild(el);
          messageContainer.append(up);

    } else if(type == "other"){
      let el = document.createElement("div");
      let up = document.createElement("p")
        el.setAttribute("class","message other-message");
        up.setAttribute("class","message my-message");
        el.innerHTML = `
          <div>
              <div class="name">${message.username}</div>
              <div class="text">${message.text}</div>
          </div>
          `; 
          up.innerHTML = `<p>time sent:  ${mergeTime}</p>`;
          messageContainer.appendChild(el);
          messageContainer.appendChild(up);
    } else if(type == "update"){
      let el = document.createElement("div");
        el.setAttribute("class","update");
        el.innerText =  message;
          messageContainer.append(el);
    }

    //scroll to the end
    messageContainer.scrollTop = messageContainer.scrollHeight - messageContainer.clientHeight;
  };
})();