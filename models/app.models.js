const db = require("../db/connection");

exports.fetchTopics = () => {
  return db.query("SELECT * FROM topics").then(({ rows }) => {
    return rows;
  });
};

exports.fetchArticleById = (id) => {
  return db
    .query(
      `SELECT articles.title, articles.topic, articles.body, articles.author, articles.created_at, articles.votes, articles.article_img_url, COUNT(comments.comment_id) AS comment_count FROM articles JOIN comments ON comments.article_id = articles.article_id WHERE articles.article_id = $1 GROUP BY articles.article_id;`,
      [id]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({
          message: "Not Found: Non-Existent Article ID",
          status: 404,
        });
      }
      return rows[0];
    });
};

exports.fetchArticles = (topic) => {
  let queryStr = `SELECT articles.article_id, articles.title, articles.topic, articles.author, articles.created_at, articles.votes, articles.article_img_url, COUNT(comments.comment_id) AS comment_count FROM articles LEFT JOIN comments ON comments.article_id = articles.article_id`;

  const paramArray = [];

  if (topic) {
    queryStr += ` WHERE topic = $1`;
    paramArray.push(topic);
  }
  queryStr += ` GROUP BY articles.article_id ORDER BY created_at DESC;`;

  return db.query(queryStr, paramArray).then(({ rows }) => {
    return rows;
  });
};

exports.fetchCommentsByArticleId = (id) => {
  return db
    .query(
      `SELECT * FROM comments WHERE article_id = $1 ORDER BY created_at DESC;`,
      [id]
    )
    .then(({ rows }) => {
      return rows;
    });
};

exports.insertNewCommentToArticle = (username, body, articleId) => {
  return db
    .query(
      `INSERT INTO comments (author, body, article_id) VALUES ($1, $2, $3) RETURNING*;`,
      [username, body, articleId]
    )
    .then(({ rows }) => {
      return rows[0];
    });
};

exports.updateVotes = (inc_votes, articleId) => {
  return db
    .query(
      `UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING*;`,
      [inc_votes, articleId]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({
          message: "Not Found: Non-Existent Article ID",
          status: 404,
        });
      }
      return rows[0];
    });
};

exports.deleteCommentFromDB = (commentId) => {
  return db
    .query(`DELETE FROM comments WHERE comment_id = $1 RETURNING*;`, [
      commentId,
    ])
    .then(({ rows }) => {
      return rows;
    });
};

exports.fetchUsers = () => {
  return db.query(`SELECT * FROM users;`).then(({ rows }) => {
    return rows;
  });
};
