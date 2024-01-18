exports.invalidPathHandler = (request, response) => {
  return response.status(404).send({ message: "Not Found: Invalid Path" });
};

exports.serverErrorHandler = (err, request, response, next) => {
  response.status(500).send({ message: "Internal Server Error" });
};

exports.customErrorHandler = (err, request, response, next) => {
  if (err.message && err.status) {
    return response.status(err.status).send({ message: err.message });
  } else {
    next(err);
  }
};

exports.psqlInvalidIntSyntaxHandler = (err, request, response, next) => {
  if (err.code === "22P02") {
    response.status(400).send({ message: "Bad Request: Invalid Article ID" });
  } else next(err);
};

exports.psqlNotNullErrorHandler = (err, request, response, next) => {
  if (err.code === "23502") {
    response
      .status(400)
      .send({ message: "Bad Request: Missing Required Fields" });
  } else next(err);
};

exports.psqlUnmetConstraintHandler = (err, request, response, next) => {
  if (err.code === "23503") {
    response.status(404).send({ message: "Not Found: Unmet Constraints" });
  } else next(err);
};
