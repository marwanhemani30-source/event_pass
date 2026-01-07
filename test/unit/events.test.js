import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "../../src/app.js";

describe("Events API", () => {
  it("GET /api/events returns a list of events", async () => {
    const res = await request(app).get("/api/events");

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });
it("GET /api/events/:id returns one event", async () => {
  const res = await request(app).get("/api/events/E1");

  expect(res.statusCode).toBe(200);
  expect(res.body).toHaveProperty("id", "E1");
  expect(res.body).toHaveProperty("name");
});

it("GET /api/events/:id returns 404 if not found", async () => {
  const res = await request(app).get("/api/events/DOES_NOT_EXIST");

  expect(res.statusCode).toBe(404);
  expect(res.body).toHaveProperty("error");
});

  it("POST /api/events creates an event", async () => {
    const res = await request(app)
      .post("/api/events")
      .send({ name: "Mon event test" });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("id");
    expect(res.body.name).toBe("Mon event test");
    expect(res.body.status).toBe("draft");
  });

  it("POST /api/events without name returns 400", async () => {
    const res = await request(app)
      .post("/api/events")
      .send({});

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("error");
  });
  it("PUT /api/events/:id updates an event", async () => {
  const res = await request(app)
    .put("/api/events/E1")
    .send({ name: "Updated name" });

  expect(res.statusCode).toBe(200);
  expect(res.body).toHaveProperty("id", "E1");
  expect(res.body.name).toBe("Updated name");
});

it("PUT /api/events/:id returns 404 if not found", async () => {
  const res = await request(app)
    .put("/api/events/NOPE")
    .send({ name: "X" });

  expect(res.statusCode).toBe(404);
  expect(res.body).toHaveProperty("error");
});

it("PUT /api/events/:id returns 400 if no fields provided", async () => {
  const res = await request(app)
    .put("/api/events/E1")
    .send({});

  expect(res.statusCode).toBe(400);
  expect(res.body).toHaveProperty("error");
});
it("POST /api/events/:id/publish sets status to published", async () => {
  const res = await request(app).post("/api/events/E1/publish");

  expect(res.statusCode).toBe(200);
  expect(res.body).toHaveProperty("id", "E1");
  expect(res.body.status).toBe("published");
});

it("POST /api/events/:id/unpublish sets status to draft", async () => {
  const res = await request(app).post("/api/events/E1/unpublish");

  expect(res.statusCode).toBe(200);
  expect(res.body).toHaveProperty("id", "E1");
  expect(res.body.status).toBe("draft");
});

it("POST /api/events/:id/publish returns 404 if not found", async () => {
  const res = await request(app).post("/api/events/NOPE/publish");

  expect(res.statusCode).toBe(404);
  expect(res.body).toHaveProperty("error");
});
it("GET /api/events/:id/sessions returns sessions for an event", async () => {
  const res = await request(app).get("/api/events/E1/sessions");

  expect(res.statusCode).toBe(200);
  expect(Array.isArray(res.body)).toBe(true);
  // on a au moins S1 dans l'initial state
  expect(res.body.length).toBeGreaterThan(0);
  expect(res.body[0]).toHaveProperty("eventId", "E1");
});

it("POST /api/events/:id/sessions creates a session", async () => {
  const res = await request(app)
    .post("/api/events/E1/sessions")
    .send({
      startTime: "2026-01-11T18:00:00",
      endTime: "2026-01-11T20:00:00",
      timezone: "Europe/Paris"
    });

  expect(res.statusCode).toBe(201);
  expect(res.body).toHaveProperty("id");
  expect(res.body).toHaveProperty("eventId", "E1");
  expect(res.body).toHaveProperty("startTime", "2026-01-11T18:00:00");
});

it("POST /api/events/:id/sessions returns 400 if missing times", async () => {
  const res = await request(app)
    .post("/api/events/E1/sessions")
    .send({});

  expect(res.statusCode).toBe(400);
  expect(res.body).toHaveProperty("error");
});

it("GET /api/events/:id/sessions returns 404 if event not found", async () => {
  const res = await request(app).get("/api/events/NOPE/sessions");

  expect(res.statusCode).toBe(404);
  expect(res.body).toHaveProperty("error");
});
it("GET /api/events/:id/ticket-types returns ticket types for an event", async () => {
  const res = await request(app).get("/api/events/E1/ticket-types");

  expect(res.statusCode).toBe(200);
  expect(Array.isArray(res.body)).toBe(true);
  expect(res.body.length).toBeGreaterThan(0);
  expect(res.body[0]).toHaveProperty("eventId", "E1");
});

it("POST /api/events/:id/ticket-types creates a ticket type", async () => {
  const res = await request(app)
    .post("/api/events/E1/ticket-types")
    .send({ name: "VIP", price: 30, capacity: 50 });

  expect(res.statusCode).toBe(201);
  expect(res.body).toHaveProperty("id");
  expect(res.body).toHaveProperty("eventId", "E1");
  expect(res.body.name).toBe("VIP");
  expect(res.body.price).toBe(30);
  expect(res.body.capacity).toBe(50);
});

it("POST /api/events/:id/ticket-types returns 400 if missing fields", async () => {
  const res = await request(app)
    .post("/api/events/E1/ticket-types")
    .send({ name: "Bad" });

  expect(res.statusCode).toBe(400);
  expect(res.body).toHaveProperty("error");
});

it("GET /api/events/:id/ticket-types returns 404 if event not found", async () => {
  const res = await request(app).get("/api/events/NOPE/ticket-types");

  expect(res.statusCode).toBe(404);
  expect(res.body).toHaveProperty("error");
});


});
