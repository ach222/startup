const express = require("express");

const { ensureLoggedInMiddleware } = require("./authRouter");
const utils = require("./utils");
const { getArticle } = require("./promptService");
const { MODE_EASY, MODE_HARD } = require("./constants");

const promptRouter = express.Router();
promptRouter.use(ensureLoggedInMiddleware);

promptRouter.get("/", async (req, res) => {
  const { gameMode } = req.query;
  if (
    gameMode === undefined ||
    !(gameMode === MODE_EASY || gameMode === MODE_HARD)
  ) {
    utils.sendBadRequest(res);
    return;
  }

  const article = await getArticle(gameMode);

  // Broadcast the game start to everyone
  req.app.locals.scoresWebSocketManager.broadcastGameStart(
    req.loggedInUser.username,
    gameMode
  );

  res.send(article);
});

module.exports = { promptRouter };
