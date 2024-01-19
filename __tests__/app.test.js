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
  test("200- should return an array of topic objects with the correct properties", () => {
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
  test("200- should respond with an object describing all available endpoints (and their methods) on the API", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body }) => {
        expect(body.endpoints).toEqual(endpointDoc);
      });
  });
});

describe("GET /api/articles/:article_id", () => {
  test("200- should respond with an article object containing the correct properties", () => {
    return request(app)
      .get("/api/articles/3")
      .expect(200)
      .then(({ body: { article } }) => {
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

describe("GET /api/articles", () => {
  test("200- should respond with an array of article objects, each with the correct properties", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body: { articles } }) => {
        if (articles.length > 1) {
          articles.forEach((article) => {
            expect(article).toHaveProperty("article_id");
            expect(article).toHaveProperty("title");
            expect(article).toHaveProperty("topic");
            expect(article).toHaveProperty("author");
            expect(article).toHaveProperty("created_at");
            expect(article).toHaveProperty("votes");
            expect(article).toHaveProperty("article_img_url");
            expect(article).toHaveProperty("comment_count");
          });
        }
      });
  });
  test("200- should return articles sorted by date in descending order", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles[0]).toEqual({
          article_id: 3,
          title: "Eight pug gifs that remind me of mitch",
          topic: "mitch",
          author: "icellusedkars",
          created_at: "2020-11-03T09:12:00.000Z",
          votes: 0,
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
          comment_count: "2",
        });
        expect(articles[articles.length - 1]).toEqual({
          article_id: 7,
          title: "Z",
          topic: "mitch",
          author: "icellusedkars",
          created_at: "2020-01-07T14:08:00.000Z",
          votes: 0,
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
          comment_count: "0",
        });
      });
  });
});

describe("GET /api/articles/:article_id/comments", () => {
  test("200- should return an array of comment objects for a given article id, with each comment object containing the correct properties", () => {
    return request(app)
      .get("/api/articles/3/comments")
      .expect(200)
      .then(({ body: { comments } }) => {
        comments.forEach((comment) => {
          expect(typeof comment.comment_id).toBe("number"),
            expect(typeof comment.body).toBe("string"),
            expect(typeof comment.article_id).toBe("number"),
            expect(typeof comment.author).toBe("string"),
            expect(typeof comment.votes).toBe("number"),
            expect(typeof comment.created_at).toBe("string");
        });
      });
  });
  test("200- should return an array of comment objects sorted by creation date in descending order", () => {
    return request(app)
      .get("/api/articles/3/comments")
      .expect(200)
      .then(({ body: { comments } }) => {
        expect(comments).toBeSortedBy("created_at", {
          descending: true,
          coerce: true,
        });
      });
  });
  test("200- should return an empty array when there are no comments on given article", () => {
    return request(app)
      .get("/api/articles/4/comments")
      .expect(200)
      .then(({ body }) => {
        expect(body).toEqual({ comments: [] });
      });
  });
  test("404- should return correct error message when article_id is valid, but it doesn't exist in the database", () => {
    return request(app)
      .get("/api/articles/88/comments")
      .expect(404)
      .then(({ body: { message } }) => {
        expect(message).toBe("Not Found: Non-Existent Article ID");
      });
  });
  test("400- should return correct error message when given invalid article_id", () => {
    return request(app)
      .get("/api/articles/bestarticle/comments")
      .expect(400)
      .then(({ body: { message } }) => {
        expect(message).toBe("Bad Request: Invalid Article ID");
      });
  });
});

describe("POST /api/articles/:article_id/comments", () => {
  test("201- should take a comment object with username and body properties, and post comment to specified article", () => {
    const newComment = { username: "lurker", body: "Sing to me Paolo!" };
    return request(app)
      .post(`/api/articles/7/comments`)
      .send(newComment)
      .expect(201)
      .then(({ body: { comment } }) => {
        expect(comment).toMatchObject({
          comment_id: 19,
          body: "Sing to me Paolo!",
          article_id: 7,
          author: "lurker",
          votes: 0,
        });
        expect(typeof comment.created_at).toBe("string");
      });
  });
  test("400- returns correct error message if any fields in request body are read as null", () => {
    const newComment = { username: "lurker" };
    return request(app)
      .post("/api/articles/7/comments")
      .send(newComment)
      .expect(400)
      .then(({ body: { message } }) => {
        expect(message).toBe("Bad Request: Missing Required Fields");
      });
  });
  test("400- returns correct error message if article id given is not an integer", () => {
    const newComment = { username: "lurker", body: "Sing to me Paolo!" };
    return request(app)
      .post("/api/articles/article7/comments")
      .send(newComment)
      .expect(400)
      .then(({ body: { message } }) => {
        expect(message).toBe("Bad Request: Invalid Article ID");
      });
  });
  test("404- returns correct error message if request body violates database constraints, i.e. username is a foreign key, and mizzparigi88 not present on users table", () => {
    const newComment = { username: "mizzparigi88", body: "Sing to me Paolo!" };
    return request(app)
      .post("/api/articles/7/comments")
      .send(newComment)
      .expect(404)
      .then(({ body: { message } }) => {
        expect(message).toBe("Not Found: Unmet Constraints");
      });
  });
  test("404- returns correct error message if article_id match not found in database", () => {
    const newComment = { username: "lurker", body: "Sing to me Paolo!" };
    return request(app)
      .post("/api/articles/796/comments")
      .send(newComment)
      .expect(404)
      .then(({ body: { message } }) => {
        expect(message).toBe("Not Found: Unmet Constraints");
      });
  });
});

describe("PATCH /api/articles/:article_id", () => {
  test("200- successfully INCREMENTS the votes on an article by a given inc_votes value", () => {
    const voteUpdate = { inc_votes: 15 };
    return request(app)
      .patch("/api/articles/13")
      .send(voteUpdate)
      .expect(200)
      .then(({ body: { updatedArticle } }) => {
        expect(updatedArticle).toMatchObject({
          article_id: 13,
          title: "Another article about Mitch",
          topic: "mitch",
          author: "butter_bridge",
          body: "There will never be enough articles about Mitch!",
          created_at: "2020-10-11T11:24:00.000Z",
          votes: 15,
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
        });
      });
  });
  test("200- successfully DECREMENTS the votes on an article by a given inc_votes value", () => {
    const voteUpdate = { inc_votes: -55 };
    return request(app)
      .patch("/api/articles/1")
      .send(voteUpdate)
      .expect(200)
      .then(({ body: { updatedArticle } }) => {
        expect(updatedArticle).toEqual({
          article_id: 1,
          title: "Living in the shadow of a great man",
          topic: "mitch",
          author: "butter_bridge",
          body: "I find this existence challenging",
          created_at: "2020-07-09T20:11:00.000Z",
          votes: 45,
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
        });
      });
  });
  test("404- returns NOT FOUND where article_id isn't in database", () => {
    const voteUpdate = { inc_votes: 7 };
    return request(app)
      .patch("/api/articles/59")
      .send(voteUpdate)
      .expect(404)
      .then(({ body: { message } }) => {
        expect(message).toBe("Not Found: Non-Existent Article ID");
      });
  });
  test("400- returns BAD REQUEST when article ID is invalid", () => {
    const voteUpdate = { inc_votes: 200 };
    return request(app)
      .patch("/api/articles/catsarticle")
      .send(voteUpdate)
      .expect(400)
      .then(({ body: { message } }) => {
        expect(message).toBe("Bad Request: Invalid Article ID");
      });
  });
  test("400- returns BAD REQUEST when inc_votes is wrong data type", () => {
    const voteUpdate = { inc_votes: "a million" };
    return request(app)
      .patch("/api/articles/catsarticle")
      .send(voteUpdate)
      .expect(400)
      .then(({ body: { message } }) => {
        expect(message).toBe("Bad Request: Invalid Article ID");
      });
  });
});

describe("DELETE /api/comments/:comment_id", () => {
  test("204- successfully deletes a comment associated with a given comment_id", () => {
    return request(app)
      .delete("/api/comments/10")
      .expect(204)
      .then(({ body: { noContent } }) => {
        expect(noContent).toBeUndefined();
      });
  });
  test("404- returns NOT FOUND where comment_id isn't in the database", () => {
    return request(app)
      .delete("/api/comments/1000")
      .expect(404)
      .then(({ body: { message } }) => {
        expect(message).toBe("Not Found: Non-Existent Comment ID");
      });
  });
  test("404- returns BAD REQUEST when comment_id is invalid", () => {
    return request(app)
      .delete("/api/comments/itakeitback")
      .expect(400)
      .then(({ body: { message } }) => {
        expect(message).toBe("Bad Request: Invalid Comment ID");
      });
  });
});

describe("GET /api/users", () => {
  test("200- returns an array of user objects with the correct properties", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body: { users } }) => {
        expect(users[0]).toMatchObject({
          username: "butter_bridge",
          name: "jonny",
          avatar_url:
            "https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg",
        });
        users.forEach((user) => {
          expect(typeof user.username).toBe("string"),
            expect(typeof user.name).toBe("string"),
            expect(typeof user.avatar_url).toBe("string");
        });
      });
  });
});

describe("GET /api/articles?topic=''", () => {
  test("200- returns all articles matching the specified topic query", () => {
    return request(app)
      .get("/api/articles?topic=mitch")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles.length).toBe(12);
        articles.forEach((article) => {
          expect(article.topic).toBe("mitch");
        });
      });
  });
  test("200- returns empty array if query is valid but there are no matching articles", () => {
    return request(app)
      .get("/api/articles?topic=paper")
      .expect(200)
      .then(({ body }) => {
        expect(body).toEqual({ articles: [] });
      });
  });
  test("200- returns all articles if no query given", () => {
    return request(app)
      .get("/api/articles?topic=")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles.length).toBe(13);
      });
  });
  test("404- returns NOT FOUND if query isn't a topic in database", () => {
    return request(app)
      .get("/api/articles?topic=ferns")
      .expect(404)
      .then(({ body: { message } }) => {
        expect(message).toEqual("Not Found: Non-Existent Topic");
      });
  });
});
