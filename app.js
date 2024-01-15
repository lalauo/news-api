const express = require("express");
const { getTopics, getEndpoints } = require("./controllers/news.controllers");
const { invalidPathHandler } = require("./controllers/errors.controllers");
const app = express();

app.use(express.json());

app.get("/api/topics", getTopics);
app.get("/api", getEndpoints);

app.all("*", invalidPathHandler);

module.exports = app;
