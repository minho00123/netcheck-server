const cors = require("cors");
const express = require("express");
const app = express();

const result = require("./routes/result");

app.use(cors());
app.use(express.json());
app.use(result);

module.exports = app;
