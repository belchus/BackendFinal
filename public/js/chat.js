const socket = io.connect();
const channel = document.getElementById("channel");
const inbox = document.getElementById("thisinbox");
const contentMsg = document.getElementById("chat-imput");
const send = document.getElementById("send");
const channelTitl = document.getElementById("channelTitl");

let channelUser;


function setUserType(type) {
  if (type === "true") {
    return "sistema";
  } else {
    return "user";
  }
}

function functionImputs() {
  if (contentMsg.value === "") {
    send.setAttribute("disabled", send);
  } else {
    send.removeAttribute("disabled");
  }
}

contentMsg.addEventListener("keyup", () => {
  contentMsg.setAttribute("value", contentMsg.value);
  functionImputs();
});

send.addEventListener("click", () => {
  const msg = {
    to: channelUser,
    firstname: `${thisUser.firstname} ${thisUser.lastname}`,
    email: thisUser.user,
    rol: setUserType(thisUser.tipo),
    msg: contentMsg.value,
  };
  socket.emit("new-message", msg);
  contentMsg.value = "";
  functionImputs();
});

socket.on("channels", (channels) => {
  channelUser = thisUser.user;
  allChannels = channels
    .map(
      (user) => `
    <div id=${user.email} >
    <div> <br> ${user.firstname} </div>
    <div>${user.email}</div>
    <div>tipo: ${user.rol}</div>
    </div>
    `
    )
    .join("");
  channel.innerHTML = allChannels;

  const channelButtons = document.querySelectorAll(".open-channel");
  channelButtons.forEach((button) => {
    button.addEventListener("click", () => {
      channelUser = button.id;
      const channeled = `canal de ${button.id} seleccionado`;
      channelTitl.innerHTML = channeled;
      socket.emit("join-room", button.id);
      socket.emit("change-room", button.id);
    });
  });
});

socket.on("recibir-mensajes", (msg) => {
  const inboxs = msg
    .map(
      (msg) => 
      ` <div class=msg-container-${msg.rol}>
          <div class=mail-${msg.rol}>${msg.email}:</div>
          <div class=msg-${msg.rol}>${msg.msg}</div>
          <div class=hora-${msg.tipo}> ${msg.date}</div>
          </div>
         `
    )
    .join("");
 inbox.innerHTML = inboxs;
});

socket.on("switch-room", (msg) => {
  const inboxs = msg
    .map(
      (msg) => `
          <div class=msg-container-${msg.rol}>
          <div class=mail-${msg.rol}>${msg.email}:</div>
          <div class=msg-${msg.rol}>${msg.msg}</div>
          <div class=hora-${msg.rol}> enviado el: ${msg.date}</div>
          </div>
          `
    )
    .join("");
 inbox.innerHTML = inboxs;
});
