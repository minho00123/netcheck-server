require("dotenv").config();
require("./db");

const cors = require("cors");
const express = require("express");
const app = express();

const result = require("./routes/result");
const share = require("./routes/share");

app.use(
  cors({
    origin: true,
    credentials: true,
  }),
);
app.use(express.json());
app.use(result);
app.use(share);

module.exports = app;
