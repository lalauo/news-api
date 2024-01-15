const request = require("supertest");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data");
const app = require("../app");

beforeEach(() => {
  return seed(data);
});

afterAll(() => {
  return db.end();
});

describe("GET- /api/topics", () => {
  test("200- should respond with 200 status code", () => {
    return request(app).get("/api/topics").expect(200);
  });
  test("should return an array of topic objects with the correct properties", () => {
    return request(app)
      .get("/api/topics")
      .then(({ body }) => {
        const topics = body.topics;
        expect(Array.isArray(topics)).toBe(true);
        topics.forEach((topic) => {
          expect(topic).toHaveProperty("slug");
          expect(topic).toHaveProperty("description");
        });
      });
  });
  test("404- should respond with correct error message for invalid paths", () => {
    return request(app)
      .get("/api/topsics")
      .expect(404)
      .then(({ body }) => {
        const errorMessage = body.message;
        expect(errorMessage).toBe("Not Found: Invalid Path");
      });
  });
});

describe("GET /api", () => {
  test("should respond with an object describing all available endpoints (and their methods) on the API", () => {
    return request(app)
      .get("/api")
      .then(({ body }) => {
        expect(Object.keys(body)).toEqual([
          "GET /api",
          "GET /api/topics",
          "GET /api/articles",
        ]);
      });
  });
});
