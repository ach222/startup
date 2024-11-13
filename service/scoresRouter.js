const express = require("express");

const { ensureLoggedInMiddleware } = require("./authRouter");
const { getHighScores, publishScore } = require("./scoresService");

const scoresRouter = express.Router();
scoresRouter.use(ensureLoggedInMiddleware);

scoresRouter.get("/", async (req, res) => {
  res.send(await getHighScores(req.loggedInUser.username));
});

scoresRouter.post("/", async (req, res) => {
  const { gameMode, scoreWPM } = req.body;
  if (gameMode === undefined || scoreWPM === undefined) {
    utils.sendBadRequest(res);
    return;
  }

  res.send(await publishScore(req.loggedInUser.username, gameMode, scoreWPM));
});

module.exports = { scoresRouter };
