const validator = require("validator");

function sendUnauthorized(res, message = undefined) {
  res.status(401).send({ message: message ?? "Unauthorized" });
}

function sendBadRequest(res, message = undefined) {
  res.status(400).send({ message: message ?? "Bad request" });
}

function validateUsername(username) {
  return /[A-Za-z0-9\-_]+/.test(username);
}

function validateEmail(email) {
  return validator.isEmail(email);
}

module.exports = {
  sendUnauthorized,
  sendBadRequest,
  validateUsername,
  validateEmail,
};
