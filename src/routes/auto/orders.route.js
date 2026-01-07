import express from "express";
import crypto from "node:crypto";
import { store } from "../../store.js";

const router = express.Router();

function genToken() {
  return crypto.randomBytes(16).toString("hex");
}

// POST /api/orders
// body: { eventId, sessionId, items: [{ ticketTypeId, qty }] }
router.post("/api/orders", (req, res) => {
  const { eventId, sessionId = null, items = [] } = req.body;

  if (!eventId || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: "Missing eventId or items" });
  }

  const eventExists = store.events.some(e => e.id === eventId);
  if (!eventExists) return res.status(404).json({ error: "Event not found" });

  if (sessionId) {
    const sessionExists = store.sessions.some(s => s.id === sessionId && s.eventId === eventId);
    if (!sessionExists) return res.status(404).json({ error: "Session not found for this event" });
  }

  // calcul total simple
  let total = 0;
  for (const it of items) {
    const tt = store.ticketTypes.find(t => t.id === it.ticketTypeId && t.eventId === eventId);
    if (!tt) return res.status(404).json({ error: "Ticket type not found for this event" });

    const qty = Number(it.qty || 1);
    if (qty <= 0) return res.status(400).json({ error: "Invalid qty" });

    total += tt.price * qty;
  }

  const order = {
    id: `O${store.nextOrderId++}`,
    eventId,
    sessionId,
    items: items.map(it => ({ ticketTypeId: it.ticketTypeId, qty: Number(it.qty || 1) })),
    total,
    status: "created",
    createdAt: new Date().toISOString()
  };

  store.orders.push(order);
  return res.status(201).json(order);
});

// POST /api/orders/:id/confirm
// Génère des tickets (1 ticket par qty)
router.post("/api/orders/:id/confirm", (req, res) => {
  const { id } = req.params;

  const order = store.orders.find(o => o.id === id);
  if (!order) return res.status(404).json({ error: "Order not found" });

  if (order.status !== "created") {
    return res.status(409).json({ error: "Order not confirmable" });
  }

  order.status = "paid";

  const createdTickets = [];
  for (const it of order.items) {
    for (let i = 0; i < it.qty; i++) {
      const ticket = {
        id: `TK${store.nextTicketId++}`,
        orderId: order.id,
        eventId: order.eventId,
        sessionId: order.sessionId,
        ticketTypeId: it.ticketTypeId,
        status: "issued",
        qrToken: genToken(),
        checkedInAt: null
      };
      store.tickets.push(ticket);
      createdTickets.push(ticket);
    }
  }

  return res.json({ ok: true, orderId: order.id, tickets: createdTickets });
});

export default router;
