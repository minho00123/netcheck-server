require("dotenv").config();
require("./db");

const cors = require("cors");
const express = require("express");
const app = express();

app.use(
  cors({
    origin: "*",
    credentials: true,
    optionsSuccessStatus: 200,
  }),
);

app.use(express.json());

const result = require("./routes/result");
const share = require("./routes/share");

app.use(result);
app.use(share);

module.exports = app;
