const express = require("express");
const {
  getTopics,
  getEndpoints,
  getArticleById,
  getArticles,
  getCommentsByArticleId,
  postNewCommentToArticle,
  updateArticleById,
  deleteCommentById,
  getUsers,
} = require("./controllers/app.controllers");
const {
  invalidPathHandler,
  customErrorHandler,
  psqlInvalidIntSyntaxHandler,
  psqlNotNullErrorHandler,
  psqlUnmetConstraintsHandler,
} = require("./controllers/errors.controllers");
const app = express();
app.use(express.json());

app.get("/api/topics", getTopics);
app.get("/api", getEndpoints);
app.get("/api/articles/:article_id", getArticleById);
app.get("/api/articles", getArticles);
app.get("/api/articles/:article_id/comments", getCommentsByArticleId);
app.get("/api/users", getUsers);

app.post("/api/articles/:article_id/comments", postNewCommentToArticle);

app.patch("/api/articles/:article_id", updateArticleById);

app.delete("/api/comments/:comment_id",deleteCommentById);

app.all("*", invalidPathHandler);

app.use(customErrorHandler);
app.use(psqlInvalidIntSyntaxHandler);
app.use(psqlNotNullErrorHandler);
app.use(psqlUnmetConstraintsHandler);

module.exports = app;
