const bodyParser = require("body-parser");
const express = require("express");
const { default: mongoose } = require("mongoose");
const morgan = require("morgan");
const { authRouter } = require("./auth");
const { urlRouter } = require("./urlRouter");
require("./watcher");
mongoose.set("strictQuery", false);
mongoose.connect("mongodb://127.0.0.1:27017/Web", { dbName: "Web" }, (err) => {
  if (!err) console.log("DB connected");
  else {
    console.error("DB Error", err);
    process.exit(1);
  }
});
const app = express();
app.use(morgan("dev"));
app.use(bodyParser.json());

app.use(authRouter);
app.use(urlRouter);

module.exports = app;
