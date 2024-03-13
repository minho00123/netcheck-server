const cors = require("cors");
const express = require("express");
const traceroute = require("./src/traceroute");
const dnsPromises = require("node:dns").promises;
const app = express();

app.use(cors());
app.use(express.json());

app.post("/data", async (req, res) => {
  try {
    const { url } = req.body;
    const modifiedUrl = url.slice(url.lastIndexOf("/") + 1);
    const tracerouteResult = await traceroute(modifiedUrl);

    for (const data of tracerouteResult) {
      const response = await fetch(`http://ip-api.com/json/${data.ipAddress}`);
      const res = await response.json();

      data.country = res.country;
      data.city = res.city;
      data.lat = res.lat;
      data.lon = res.lon;
    }

    const { address } = await dnsPromises.lookup(modifiedUrl);
    const locationResponse = await fetch(`http://ip-api.com/json/${address}`);
    const locationInfo = await locationResponse.json();
    const urlInfo = {
      ipAddress: address,
      country: locationInfo.country,
      city: locationInfo.city,
    };

    res.status(200).send([tracerouteResult, urlInfo]);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send({ message: "서버에서 에러가 발생했습니다.", error: error.message });
  }
});

module.exports = app;
