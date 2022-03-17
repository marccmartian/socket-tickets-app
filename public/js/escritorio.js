// referencias al html
lblDesktop = document.querySelector("h1");
btnAttend = document.querySelector("button");
lblTicket = document.querySelector("small");
divAlert = document.querySelector(".alert");
lblPendientes = document.querySelector("#lblPendientes");

const searchParams = new URLSearchParams(window.location.search);

if (!searchParams.has("escritorio")) {
  window.location = "index.html";
  throw new Error("El escritorio es obligatorio");
}

const desktop = searchParams.get("escritorio");
lblDesktop.innerText = desktop;

divAlert.style.display = "none";

const socket = io();

socket.on("connect", () => {
  btnAttend.disabled = false;
});

socket.on("disconnect", () => {
  btnAttend.disabled = true;
});

socket.on("pending-tickets", (pending) => {
  if (pending === 0) {
    lblPendientes.style.display = "none";
  } else {
    lblPendientes.style.display = "";
    lblPendientes.innerText = pending;
  }
});

btnAttend.addEventListener("click", () => {
  socket.emit("attend-ticket", { desktop }, ({ ok, ticket, msg }) => {
    if (!ok) {
      lblTicket.innerText = "Nadie";
      return (divAlert.style.display = "");
    }

    lblTicket.innerText = "Ticket " + ticket.number;
  });
});
