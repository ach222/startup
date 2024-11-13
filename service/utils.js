function sendUnauthorized(res, message = undefined) {
  res.status(401).send({ message: message ?? "Unauthorized" });
}

function sendBadRequest(res, message = undefined) {
  res.status(400).send({ message: message ?? "Bad request" });
}

module.exports = {
  sendUnauthorized,
  sendBadRequest,
};
