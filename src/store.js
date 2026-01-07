// src/store.js
export const store = {
  // EVENTS
  events: [
    { id: "E1", name: "PassEvent Demo", status: "published" }
  ],

  // SESSIONS
  sessions: [
    {
      id: "S1",
      eventId: "E1",
      startTime: "2026-01-10T18:00:00",
      endTime: "2026-01-10T20:00:00",
      timezone: "Europe/Paris",
      status: "scheduled"
    }
  ],

  // TICKET TYPES
  ticketTypes: [
    { id: "T1", eventId: "E1", name: "Standard", price: 10, capacity: 100 }
  ],

  // ORDERS
  orders: [],

  // TICKETS (issus des orders confirmés)
  tickets: [],

  // Counters
  nextSessionId: 2,
  nextTicketTypeId: 2,
  nextOrderId: 1,
  nextTicketId: 1
};
