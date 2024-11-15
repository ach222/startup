const express = require("express");

const utils = require("./utils");
const userService = require("./authService");

const authRouter = express.Router();

const TOKEN_COOKIE_KEY = "token";
const COOKIE_OPTIONS = {
  secure: true,
  httpOnly: true,
  sameSite: "strict",
};

const BAD_EMAIL_MESSAGE =
  "Invalid email address! Please use the format `<name>@<domain>.<tld>`. Please note that `<tld>` must be a common top-level domain.";

function deleteAuthCookie(res) {
  return res.clearCookie(TOKEN_COOKIE_KEY, COOKIE_OPTIONS);
}

function setAuthCookie(res, sessionToken) {
  res.cookie(TOKEN_COOKIE_KEY, sessionToken, COOKIE_OPTIONS);
}

function getAuthCookie(req) {
  return req.cookies[TOKEN_COOKIE_KEY];
}

async function ensureLoggedInMiddleware(req, res, next) {
  const sessionToken = getAuthCookie(req);

  if (sessionToken === undefined) {
    utils.sendUnauthorized(res);
    return;
  }

  const user = await userService.getUserByToken(sessionToken);

  if (user === null) {
    deleteAuthCookie(res);
    utils.sendUnauthorized(res);
    return;
  }

  req.loggedInUser = user;

  next();
}

authRouter.get("/", ensureLoggedInMiddleware, (req, res) => {
  const { email, username } = req.loggedInUser;

  const response = {
    email,
    username,
  };

  res.send(response);
});

authRouter.post("/register", async (req, res) => {
  const { email, username, password } = req.body;
  if (
    email === undefined ||
    username === undefined ||
    password === undefined ||
    password === ""
  ) {
    utils.sendBadRequest(res);
    return;
  }

  if (!utils.validateEmail(email)) {
    utils.sendBadRequest(res, BAD_EMAIL_MESSAGE);
    return;
  }

  if (!utils.validateUsername(username)) {
    utils.sendBadRequest(
      res,
      "A username must consist of alphanumeric characters and the special characters `-` and `_`."
    );
    return;
  }

  if ((await userService.getUserByEmail(email)) !== null) {
    utils.sendBadRequest(res, "That email is already taken!");
    return;
  }

  if ((await userService.getUserByUsername(username)) !== null) {
    utils.sendBadRequest(res, "That username is already taken!");
    return;
  }

  const newUser = await userService.newUser(email, username, password);

  setAuthCookie(res, newUser.sessionToken);

  const response = {
    email: newUser.email,
    username: newUser.username,
  };

  res.send(response);
});

authRouter.post("/", async (req, res) => {
  const { email, password } = req.body;

  if (email === undefined || password === undefined || password === "") {
    utils.sendBadRequest(res);
    return;
  }

  if (!utils.validateEmail(email)) {
    utils.sendBadRequest(res, BAD_EMAIL_MESSAGE);
    return;
  }

  const user = await userService.loginUser(email, password);

  if (user === null) {
    utils.sendUnauthorized(res, "Bad email and/or password.");
    return;
  }

  setAuthCookie(res, user.sessionToken);

  const response = {
    email: user.email,
    username: user.username,
  };

  res.send(response);
});

authRouter.delete("/", ensureLoggedInMiddleware, async (req, res) => {
  await userService.logoutUser(getAuthCookie(req));
  deleteAuthCookie(res);
  res.send("");
});

module.exports = {
  authRouter,
  ensureLoggedInMiddleware,
};
