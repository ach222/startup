const express = require("express");

const { ensureLoggedInMiddleware } = require("./authRouter");
const { getHighScores, publishScore } = require("./scoresService");
const { MODE_EASY, MODE_HARD } = require("./constants");

const scoresRouter = express.Router();
scoresRouter.use(ensureLoggedInMiddleware);

scoresRouter.get("/", async (req, res) => {
  res.send(await getHighScores(req.loggedInUser.username));
});

scoresRouter.post("/", async (req, res) => {
  const { gameMode, scoreWPM } = req.body;
  if (
    gameMode === undefined ||
    scoreWPM === undefined ||
    !(gameMode === MODE_EASY || gameMode === MODE_HARD) ||
    scoreWPM < 0
  ) {
    utils.sendBadRequest(res);
    return;
  }

  // Broadcast the score to everyone
  req.app.locals.scoresWebSocketManager.broadcastGameComplete(
    req.loggedInUser.username,
    gameMode,
    scoreWPM
  );

  res.send(await publishScore(req.loggedInUser.username, gameMode, scoreWPM));
});

module.exports = { scoresRouter };
