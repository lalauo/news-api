const express = require("express");
const { getTopics } = require("./controllers/news.controllers");
const {
  invalidPathHandler,
  serverErrorHandler,
} = require("./controllers/errors.controllers");
const app = express();

app.use(express.json());

app.get("/api/topics", getTopics);
app.get("/api");

app.all("*", invalidPathHandler);
app.use(serverErrorHandler);

module.exports = app;
