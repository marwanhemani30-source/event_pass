import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "../src/app.js";


describe("Check-in API", () => {
  it("scan returns accepted then duplicate for same qrToken", async () => {
    // 1) create + confirm an order to get a real ticket token
    const create = await request(app)
      .post("/api/orders")
      .send({
        eventId: "E1",
        sessionId: "S1",
        items: [{ ticketTypeId: "T1", qty: 1 }]
      });

    expect(create.statusCode).toBe(201);

    const confirm = await request(app)
      .post(`/api/orders/${create.body.id}/confirm`)
      .send({});

    expect(confirm.statusCode).toBe(200);
    const token = confirm.body.tickets[0].qrToken;
    expect(token).toBeTruthy();

    // 2) first scan -> accepted
    const scan1 = await request(app)
      .post("/api/checkin/scan")
      .send({ qrToken: token });

    expect(scan1.statusCode).toBe(200);
    expect(scan1.body.status).toBe("accepted");

    // 3) second scan -> duplicate
    const scan2 = await request(app)
      .post("/api/checkin/scan")
      .send({ qrToken: token });

    expect(scan2.statusCode).toBe(200);
    expect(scan2.body.status).toBe("duplicate");
  });

  it("scan returns 404 invalid if token not found", async () => {
    const res = await request(app)
      .post("/api/checkin/scan")
      .send({ qrToken: "does-not-exist" });

    expect(res.statusCode).toBe(404);
    expect(res.body.status).toBe("invalid");
  });

  it("scan returns 400 if missing qrToken", async () => {
    const res = await request(app)
      .post("/api/checkin/scan")
      .send({});

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("error");
  });
});
