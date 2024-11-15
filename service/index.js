const express = require("express");
const cookieParser = require("cookie-parser");

const { ensureDB } = require("./db");
const { authRouter } = require("./authRouter");
const { scoresRouter } = require("./scoresRouter");
const { promptRouter } = require("./promptRouter");

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

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
