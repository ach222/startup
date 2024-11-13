const express = require("express");

const { ensureLoggedInMiddleware } = require("./authRouter");
const utils = require("./utils");
const { getArticle } = require("./promptService");

const promptRouter = express.Router();
promptRouter.use(ensureLoggedInMiddleware);

promptRouter.get("/", async (req, res) => {
  const { gameMode } = req.query;
  if (gameMode === undefined) {
    utils.sendBadRequest(res);
    return;
  }

  res.send(await getArticle(gameMode));
});

module.exports = { promptRouter };
