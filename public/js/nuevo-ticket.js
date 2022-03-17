const lblNuevoTicket = document.querySelector("#lblNuevoTicket");
const btnCreate = document.querySelector("button");

const socket = io();

// si el socket server conectado el boton esta habilitado y viceversa
socket.on("connect", () => {
  btnCreate.disabled = false;
});

socket.on("disconnect", () => {
  btnCreate.disabled = true;
});

// para que siempre aparezca el ultimo ticket (current)
socket.on("last-ticket", (payload) => {
  lblNuevoTicket.innerText = "Ticket " + payload;
});

btnCreate.addEventListener("click", () => {
  socket.emit("next-ticket", null, (ticket) => {
    // console.log("Desde el server: ", ticket);
    lblNuevoTicket.innerText = ticket;
  });
});
