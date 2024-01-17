const express = require("express");
const {
  getTopics,
  getEndpoints,
  getArticleById,
  getArticles,
  getCommentsByArticleId,
} = require("./controllers/news.controllers");
const {
  invalidPathHandler,
  customErrorHandler,
  psqlErrorHandler,
} = require("./controllers/errors.controllers");
const app = express();

app.get("/api/topics", getTopics);
app.get("/api", getEndpoints);
app.get("/api/articles/:article_id", getArticleById);
app.get("/api/articles", getArticles);
app.get("/api/articles/:article_id/comments", getCommentsByArticleId);

app.all("*", invalidPathHandler);

app.use(customErrorHandler);
app.use(psqlErrorHandler);

module.exports = app;
