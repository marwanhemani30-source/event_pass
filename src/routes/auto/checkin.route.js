import express from "express";
import { store } from "../../store.js";

const router = express.Router();

// POST /api/checkin/scan { qrToken }
router.post("/api/checkin/scan", (req, res) => {
  const { qrToken } = req.body;

  if (!qrToken) {
    return res.status(400).json({ error: "Missing qrToken" });
  }

  const ticket = store.tickets.find(t => t.qrToken === qrToken);
  if (!ticket) {
    return res.status(404).json({ status: "invalid" });
  }

  if (ticket.status === "checked_in") {
    return res.status(200).json({ status: "duplicate", checkedInAt: ticket.checkedInAt });
  }

  // accepted
  ticket.status = "checked_in";
  ticket.checkedInAt = new Date().toISOString();
  return res.status(200).json({ status: "accepted" });
});

export default router;
