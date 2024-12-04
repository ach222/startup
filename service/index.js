const express = require("express");
const { createServer } = require("http");
const cookieParser = require("cookie-parser");

const { ensureDB } = require("./db");
const { authRouter } = require("./authRouter");
const { scoresRouter } = require("./scoresRouter");
const { promptRouter } = require("./promptRouter");
const { WebSocketManager } = require("./wsManager");

ensureDB();

const app = express();

const port = process.argv.length > 2 ? process.argv[2] : 3000;

app.use(express.json());
app.use(express.query());
app.use(cookieParser());

const apiRouter = express.Router();
apiRouter.use("/auth", authRouter);
apiRouter.use("/scores", scoresRouter);
apiRouter.use("/prompt", promptRouter);

app.use("/api", apiRouter);

app.use(express.static("public"));

// Redirect all not found endpoints to `index.html`
app.use("*", express.static("public/index.html"));

const server = createServer(app);
app.locals.scoresWebSocketManager = new WebSocketManager(
  server,
  "/api/scores-ws"
);

server.on("listening", () => {
  app.locals.scoresWebSocketManager.start();
});

server.on("close", () => {
  app.locals.scoresWebSocketManager.stop();
});

server.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
