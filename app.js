const cors = require("cors");
const express = require("express");
const traceroute = require("./src/traceroute");
const app = express();

app.use(cors());
app.use(express.json());

app.post("/data", async (req, res) => {
  try {
    const { url } = req.body;
    const tracerouteResult = await traceroute(url);

    res.status(200).send(tracerouteResult);
  } catch (error) {
    console.error(error);
  }
});

module.exports = app;
