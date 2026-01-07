import express from "express";
import { store } from "../../store.js";

const router = express.Router();

// -------------------------
// EVENTS
// -------------------------

// GET /api/events (liste)
router.get("/api/events", (req, res) => {
  res.json(store.events);
});

// GET /api/events/:id (un seul event)
router.get("/api/events/:id", (req, res) => {
  const { id } = req.params;

  const event = store.events.find(e => e.id === id);
  if (!event) {
    return res.status(404).json({ error: "Event not found" });
  }

  res.json(event);
});

// PUT /api/events/:id (update)
router.put("/api/events/:id", (req, res) => {
  const { id } = req.params;
  const { name, status } = req.body;

  const idx = store.events.findIndex(e => e.id === id);
  if (idx === -1) {
    return res.status(404).json({ error: "Event not found" });
  }

  if (name == null && status == null) {
    return res.status(400).json({ error: "No fields to update" });
  }

  if (name != null) store.events[idx].name = name;
  if (status != null) store.events[idx].status = status;

  return res.json(store.events[idx]);
});

// POST /api/events/:id/publish
router.post("/api/events/:id/publish", (req, res) => {
  const { id } = req.params;

  const event = store.events.find(e => e.id === id);
  if (!event) return res.status(404).json({ error: "Event not found" });

  event.status = "published";
  return res.json(event);
});

// POST /api/events/:id/unpublish
router.post("/api/events/:id/unpublish", (req, res) => {
  const { id } = req.params;

  const event = store.events.find(e => e.id === id);
  if (!event) return res.status(404).json({ error: "Event not found" });

  event.status = "draft";
  return res.json(event);
});

// POST /api/events (création)
router.post("/api/events", (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ error: "Missing event name" });
  }

  const newEvent = {
    id: `E${store.events.length + 1}`,
    name,
    status: "draft"
  };

  store.events.push(newEvent);
  res.status(201).json(newEvent);
});

// -------------------------
// SESSIONS
// -------------------------

// GET /api/events/:id/sessions (liste des sessions d’un event)
router.get("/api/events/:id/sessions", (req, res) => {
  const { id } = req.params;

  const eventExists = store.events.some(e => e.id === id);
  if (!eventExists) {
    return res.status(404).json({ error: "Event not found" });
  }

  const eventSessions = store.sessions.filter(s => s.eventId === id);
  return res.json(eventSessions);
});

// POST /api/events/:id/sessions (créer une session)
router.post("/api/events/:id/sessions", (req, res) => {
  const { id } = req.params;
  const { startTime, endTime, timezone = "Europe/Paris" } = req.body;

  const eventExists = store.events.some(e => e.id === id);
  if (!eventExists) {
    return res.status(404).json({ error: "Event not found" });
  }

  if (!startTime || !endTime) {
    return res.status(400).json({ error: "Missing startTime or endTime" });
  }

  const newSession = {
    id: `S${store.nextSessionId++}`,
    eventId: id,
    startTime,
    endTime,
    timezone,
    status: "scheduled"
  };

  store.sessions.push(newSession);
  return res.status(201).json(newSession);
});

// -------------------------
// TICKET TYPES
// -------------------------

// GET /api/events/:id/ticket-types (liste des ticket types d’un event)
router.get("/api/events/:id/ticket-types", (req, res) => {
  const { id } = req.params;

  const eventExists = store.events.some(e => e.id === id);
  if (!eventExists) {
    return res.status(404).json({ error: "Event not found" });
  }

  const list = store.ticketTypes.filter(t => t.eventId === id);
  return res.json(list);
});

// POST /api/events/:id/ticket-types (créer un ticket type)
router.post("/api/events/:id/ticket-types", (req, res) => {
  const { id } = req.params;
  const { name, price, capacity } = req.body;

  const eventExists = store.events.some(e => e.id === id);
  if (!eventExists) {
    return res.status(404).json({ error: "Event not found" });
  }

  if (!name || price == null || capacity == null) {
    return res.status(400).json({ error: "Missing name, price or capacity" });
  }

  const newTT = {
    id: `T${store.nextTicketTypeId++}`,
    eventId: id,
    name,
    price: Number(price),
    capacity: Number(capacity)
  };

  store.ticketTypes.push(newTT);
  return res.status(201).json(newTT);
});

export default router;
