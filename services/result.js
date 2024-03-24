const ping = require("../src/ping");
const getIpData = require("../src/ipAddress");
const getSslData = require("../src/ssl");
const getWhoisData = require("../src/domain");
const getHttpHeaderData = require("../src/httpHeader");
const getTracerouteData = require("../src/traceroute");
const calculateBandwidth = require("../src/bandwidth");
const getAvailabilityData = require("../src/availability");
const Result = require("../models/Result");

exports.processDataAll = async function (req, res) {
  const { id, url, serverRegion } = req.body;
  const { registrar, registerExpiryDate } = await getWhoisData(url);
  const { ipAddress, city, country } = await getIpData(url);
  const informationData = {
    registrar,
    registerExpiryDate,
    ipAddress,
    city,
    country,
  };

  const { hsts, csp } = await getHttpHeaderData(url);
  const { issuer, expiryDate } = await getSslData(url);
  const securityData = {
    hsts,
    csp,
    issuer,
    expiryDate,
  };

  const { statusCode, responseTime } = await getAvailabilityData(url);
  const { sent, received, lossRate, latencies } = await ping(ipAddress, 10);
  const reliabilityData = {
    statusCode,
    responseTime,
    sent,
    received,
    lossRate,
    latencies,
  };

  const { bandwidth } = await calculateBandwidth(url);
  const averageLatency =
    latencies.reduce((a, b) => a + b, 0) / latencies.length;
  const speedData = {
    bandwidth: bandwidth.toFixed(2),
    maxLatency: Math.max(...latencies),
    minLatency: Math.min(...latencies),
    averageLatency: averageLatency.toFixed(2),
  };

  const tracerouteData = await getTracerouteData(url);

  for (const data of tracerouteData) {
    const response = await fetch(`http://ip-api.com/json/${data.ipAddress}`);
    const res = await response.json();

    data.country = res.country;
    data.city = res.city;
    data.lat = res.lat;
    data.lon = res.lon;
  }

  const result = new Result({
    customId: id,
    url,
    serverRegion,
    informationData,
    securityData,
    reliabilityData,
    speedData,
    tracerouteData,
  });

  await result.save();

  return {
    informationData,
    securityData,
    reliabilityData,
    speedData,
    tracerouteData,
  };
};

exports.processHistoryData = async function (req, res) {
  const { url } = req.body;
  const historyData = await Result.collection.find({ url }).toArray();

  return historyData;
};

exports.processHistoryIdData = async function (req, res) {
  const { customId } = req.body;
  const historyData = await Result.collection.find({ customId }).toArray();

  return historyData;
};
