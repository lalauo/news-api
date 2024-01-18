const db = require("../connection");

exports.convertTimestampToDate = ({ created_at, ...otherProperties }) => {
  if (!created_at) return { ...otherProperties };
  return { created_at: new Date(created_at), ...otherProperties };
};

exports.createRef = (arr, key, value) => {
  return arr.reduce((ref, element) => {
    ref[element[key]] = element[value];
    return ref;
  }, {});
};

exports.formatComments = (comments, idLookup) => {
  return comments.map(({ created_by, belongs_to, ...restOfComment }) => {
    const article_id = idLookup[belongs_to];
    return {
      article_id,
      author: created_by,
      ...this.convertTimestampToDate(restOfComment),
    };
  });
};

exports.validateCommentId = (commentId) => {
  if (isNaN(commentId)) {
    return Promise.reject({
      message: "Bad Request: Invalid Comment ID",
      status: 400,
    });
  } else
    return db
      .query(`SELECT * FROM comments WHERE comment_id = $1;`, [commentId])
      .then(({ rows }) => {
        if (rows.length === 0) {
          return Promise.reject({
            message: "Not Found: Non-Existent Comment ID",
            status: 404,
          });
        }
      });
};
