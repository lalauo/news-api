exports.invalidPathHandler = (request, response) => {
  return response.status(404).send({ message: "Not Found: Invalid Path" });
};

exports.serverErrorHandler = (err, request, response, next) => {
  console.log(err);
  response.status(500).send({ message: "Internal Server Error" });
};
