const request = require("supertest");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const app = require("../app");
const data = require("../db/data/test-data");
const endpointDoc = require("../endpoints.json");

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
        expect(Object.keys(body)).toEqual(Object.keys(endpointDoc));
      });
  });
});

describe("GET /api/articles/:article_id", () => {
  test("200- should respond with an article object containing the correct properties", () => {
    return request(app)
      .get("/api/articles/3")
      .expect(200)
      .then(({ body: {article} }) => {
        expect(article).toEqual({
          article_id: 3,
          title: "Eight pug gifs that remind me of mitch",
          topic: "mitch",
          author: "icellusedkars",
          body: "some gifs",
          created_at: "2020-11-03T09:12:00.000Z",
          votes: 0,
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
        });
      });
  });
  test("404- should respond with correct error message when given a valid but non-existent article id", () => {
    return request(app)
      .get("/api/articles/30")
      .expect(404)
      .then(({ body }) => {
        expect(body.message).toBe("Not Found: Non-Existent Article ID");
      });
  });
  test("400- should respond with correct error message when given an invalid article id", () => {
    return request(app)
      .get("/api/articles/article5")
      .expect(400)
      .then(({ body }) => {
        expect(body.message).toBe("Bad Request: Invalid Article ID");
      });
  });
});
