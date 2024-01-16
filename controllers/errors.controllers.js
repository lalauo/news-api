exports.invalidPathHandler = (request, response) => {
  return response.status(404).send({ message: "Not Found: Invalid Path" });
};

exports.customErrorHandler = (err, request, response, next) => {
  if (err.message && err.status) {
    return response.status(err.status).send({ message: err.message });
  } else {
    next(err);
  }
};

exports.psqlErrorHandler = (err, request, response, next) => {
  if (err.code === "22P02") {
    response.status(400).send({ message: "Bad Request: Invalid Article ID" });
  } else next(err);
};
