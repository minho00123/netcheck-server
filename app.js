require("dotenv").config();
require("./db");

const cors = require("cors");
const express = require("express");
const app = express();

app.use(
  cors({
    origin: "https://client.netcheck.site",
    credentials: true,
  }),
);

const result = require("./routes/result");
const share = require("./routes/share");

app.use(express.json());
app.use(result);
app.use(share);

module.exports = app;
