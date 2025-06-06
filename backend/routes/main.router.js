const express = require("express");
const userRouter = require("./user.router");
// const repoRouter = require("./repo.router");
// const issueRouter = require("./issue.router");

const mainRouter = express.Router();

mainRouter.use(userRouter);
// mainRouter.use(repoRouter);
// mainRouter.use(issueRouter);

mainRouter.get("/", (req, res) => { //initially in index.js, it was app.get("/", (req, res) => { //to test the server is running--via thunder client or postman or browser
  res.send("Welcome!");
});

module.exports = mainRouter;
