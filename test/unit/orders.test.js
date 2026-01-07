import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "../../src/app.js";

describe("Orders API", () => {
  it("POST /api/orders creates an order", async () => {
    const res = await request(app)
      .post("/api/orders")
      .send({
        eventId: "E1",
        sessionId: "S1",
        items: [{ ticketTypeId: "T1", qty: 2 }]
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("id");
    expect(res.body).toHaveProperty("status", "created");
    expect(res.body.total).toBe(20);
  });

  it("POST /api/orders/:id/confirm confirms and issues tickets", async () => {
    // create order first
    const create = await request(app)
      .post("/api/orders")
      .send({
        eventId: "E1",
        sessionId: "S1",
        items: [{ ticketTypeId: "T1", qty: 2 }]
      });

    const orderId = create.body.id;

    const confirm = await request(app)
      .post(`/api/orders/${orderId}/confirm`)
      .send({});

    expect(confirm.statusCode).toBe(200);
    expect(confirm.body).toHaveProperty("ok", true);
    expect(confirm.body).toHaveProperty("orderId", orderId);
    expect(Array.isArray(confirm.body.tickets)).toBe(true);
    expect(confirm.body.tickets.length).toBe(2);
    expect(confirm.body.tickets[0]).toHaveProperty("qrToken");
  });

  it("POST /api/orders returns 400 if missing fields", async () => {
    const res = await request(app).post("/api/orders").send({});
    expect(res.statusCode).toBe(400);
  });
});
