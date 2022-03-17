const path = require("path");
const fs = require("fs");

class Ticket {
  constructor(number, desktop) {
    this.number = number;
    this.desktop = desktop;
  }
}

class TicketControl {
  constructor() {
    this.today = new Date().getDate();
    this.last = 0;
    this.tickets = [];
    this.lastFour = [];

    this.init();
  }

  get toJson() {
    return {
      last: this.last,
      today: this.today,
      tickets: this.tickets,
      lastFour: this.lastFour,
    };
  }

  init() {
    const { today, last, tickets, lastFour } = require("../db/data.json");

    if (today === this.today) {
      this.tickets = tickets;
      this.last = last;
      this.lastFour = lastFour;
    } else {
      // es otro día, resetea el ultimo a cero
      this.saveDB();
    }
  }

  saveDB() {
    const dbPath = path.join(__dirname, "../db/data.json");
    fs.writeFileSync(dbPath, JSON.stringify(this.toJson));
  }

  next() {
    this.last += 1;
    const ticket = new Ticket(this.last, null);
    this.tickets.push(ticket);

    this.saveDB();
    return "Ticket: " + ticket.number;
  }

  attendTicket(desktop) {
    // no tenemos tickets
    if (this.tickets.length === 0) {
      return null;
    }

    const ticket = this.tickets.shift(); // quitar el primer tikect - this.tickets[0]
    ticket.desktop = desktop; // ticket actual o el que esta siendo atendido

    this.lastFour.unshift(ticket); // agrega el ticket actual a lastFour pero al inicio

    // quitar ultimo elemento del arr lastFour
    if (this.lastFour.length > 4) {
      this.lastFour.splice(-1, 1);
    }

    this.saveDB();

    return ticket;
  }
}

module.exports = TicketControl;
