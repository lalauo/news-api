const {
  fetchTopics,
  fetchArticleById,
  fetchArticles,
  fetchCommentsByArticleId,
  insertNewCommentToArticle,
  updateVotes,
  deleteCommentFromDB,
  fetchUsers,
} = require("../models/app.models");
const endpoints = require("../endpoints.json");
const {
  validateCommentId,
  checkArticleExists,
  checkTopicExists,
} = require("../db/seeds/utils");

exports.getTopics = (request, response, next) => {
  fetchTopics()
    .then((topics) => {
      response.status(200).send({ topics });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getEndpoints = (request, response) => {
  response.status(200).send({ endpoints });
};

exports.getArticleById = (request, response, next) => {
  const { article_id } = request.params;

  fetchArticleById(article_id)
    .then((article) => {
      response.status(200).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getArticles = (request, response, next) => {
  const { topic } = request.query;

  if (topic) {
    const lookForTopic = checkTopicExists(topic);
    const fetchTopicQuery = fetchArticles(topic);

    Promise.all([fetchTopicQuery, lookForTopic])
      .then((resArr) => {
        const articles = resArr[0];
        response.status(200).send({ articles });
      })
      .catch((err) => {
        next(err);
      });
  }
  fetchArticles()
    .then((articles) => {
      response.status(200).send({ articles });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getCommentsByArticleId = (request, response, next) => {
  const { article_id } = request.params;

  const lookForArticle = checkArticleExists(article_id);
  const fetchCommentsQuery = fetchCommentsByArticleId(article_id);
  Promise.all([fetchCommentsQuery, lookForArticle])
    .then((resArr) => {
      const articleComments = resArr[0];
      response.status(200).send({ comments: articleComments });
    })
    .catch((err) => {
      next(err);
    });
};

exports.postNewCommentToArticle = (request, response, next) => {
  insertNewCommentToArticle(
    request.body.username,
    request.body.body,
    request.params.article_id
  )
    .then((comment) => {
      response.status(201).send({ comment });
    })
    .catch((err) => {
      next(err);
    });
};

exports.updateArticleById = (request, response, next) => {
  const { inc_votes } = request.body;
  const { article_id } = request.params;

  updateVotes(inc_votes, article_id)
    .then((updatedArticle) => {
      response.status(200).send({ updatedArticle });
    })
    .catch((err) => {
      next(err);
    });
};

exports.deleteCommentById = (request, response, next) => {
  const { comment_id } = request.params;
  const validCommentIdQuery = validateCommentId(comment_id);
  const deleteCommentQuery = deleteCommentFromDB(comment_id);

  Promise.all([deleteCommentQuery, validCommentIdQuery])
    .then((resArr) => {
      const noContent = resArr[0];
      response.status(204).send({ noContent });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getUsers = (request, response) => {
  fetchUsers().then((users) => {
    response.status(200).send({ users });
  });
};
