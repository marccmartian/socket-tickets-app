const TicketControl = require("../models/ticket-control");

const ticketControl = new TicketControl();

const socketController = (socket) => {
  // estas tres lineas suceden cuando un usuario se conecta
  socket.emit("last-ticket", ticketControl.last);
  socket.emit("current-status", ticketControl.lastFour);
  socket.emit("pending-tickets", ticketControl.tickets.length);

  socket.on("next-ticket", (payload, callback) => {
    const next = ticketControl.next();
    callback(next);
    socket.broadcast.emit("pending-tickets", ticketControl.tickets.length);
  });

  socket.on("attend-ticket", ({ desktop }, callback) => {
    if (!desktop) {
      return callback({ ok: false, msg: "El escritorio es obligatorio" });
    }

    const ticket = ticketControl.attendTicket(desktop);

    // notificar cambio a los ultimos 4 en todas las pantallas
    socket.broadcast.emit("current-status", ticketControl.lastFour);
    socket.emit("pending-tickets", ticketControl.tickets.length);
    socket.broadcast.emit("pending-tickets", ticketControl.tickets.length);

    if (!ticket) {
      callback({ ok: false, msg: "Ya no hay ticket pendientes" });
    } else {
      callback({ ok: true, ticket });
    }
  });
};

module.exports = {
  socketController,
};
