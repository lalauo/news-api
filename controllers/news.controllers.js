const { fetchTopics } = require("../models/news.models");

exports.getTopics = (request, response, next) => {
  fetchTopics()
    .then((topics) => {
      // console.log(topics, "<<<<<<<<<<<TOPICS IN CONTROLLER");
      response.status(200).send({ topics });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getEndpoints = (request, response) => {
    response.status(200).send()
};
