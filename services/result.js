const traceroute = require("../src/traceroute");
const ping = require("../src/ping");
const dnsPromises = require("node:dns").promises;

exports.processResult = async function (req, res) {
  const { url } = req.body;
  const modifiedUrl = url.slice(url.indexOf("/") + 2);
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
    url,
    ipAddress: address,
    country: locationInfo.country,
    city: locationInfo.city,
  };
  const pingResult = await ping(address, 10);

  return [tracerouteResult, urlInfo, pingResult];
};
