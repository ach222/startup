const express = require("express");
const cookieParser = require("cookie-parser");

const { ensureDB } = require("./userService");
const { authRouter } = require("./authRouter");

ensureDB();

const app = express();

const port = process.argv.length > 2 ? process.argv[2] : 3000;

app.use(express.json());
app.use(cookieParser());
app.use(express.static("public"));

app.use("/api/auth", authRouter);

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
