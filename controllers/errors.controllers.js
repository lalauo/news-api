exports.invalidPathHandler = (request, response) => {
  return response.status(404).send({ message: "Not Found: Invalid Path" });
};
