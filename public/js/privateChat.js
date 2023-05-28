const socket = io.connect();

const inbox = document.getElementById("thisinbox");
const contentMsg = document.getElementById("chat-imput");
const send = document.getElementById("send");
const thisChannel = thisUser.usuario;

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
    to: thisChannel,
    firstname: `${thisUser.firstname} ${thisUser.lastname}`,
    email: thisUser.user,
    rol: setUserType(thisUser.rol),
    msg: contentMsg.value,
  };
  socket.emit("new message", msg);
  contentMsg.value = "";
  functionImputs();
});


socket.on("start", (msg) => {
  socket.emit("join-room", thisUser.user);
  socket.emit("single-channel", thisUser.usuario);
});

socket.on("channel", (msg) => {
  const inboxs = msg
    .map(
      (msg) => `
          <div class=msg-container-${msg.rol}>
          <div class=mail-${msg.rol}>${msg.email} escribe:</div>
          <div class=msg-${msg.rol}>${msg.msg}</div>
          <div class=hora-${msg.rol}> enviado el: ${msg.date}</div>
          </div>
          `
    )
    .join("");
 inbox.innerHTML =inboxs;
});
socket.on("recibir-msgs", (msg) => {
  const inboxs =msg
    .map(
      (msg) => `
          <div class=msg-container-${msg.rol}>
          <div class=mail-${msg.rol}>${msg.email} escribe:</div>
          <div class=msg-${msg.rol}>${msg.msg}</div>
          <div class=hora-${msg.rol}> enviado el: ${msg.date}</div>
          </div>
          `
    )
    .join("");
 inbox.innerHTML = inboxs;
});
