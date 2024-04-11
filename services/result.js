const axios = require("axios");
const ping = require("../src/ping");
// const getIpData = require("../src/ipAddress");
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
  // const { ipAddress, city, country } = await getIpData(url);
  const ipAddress = "8.8.8.8";
  const city = "Seoul";
  const country = "South Korea";
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
  let speedData = {};

  if (latencies.length > 0) {
    const averageLatency =
      latencies.reduce((a, b) => a + b, 0) / latencies.length;
    speedData = {
      bandwidth: bandwidth.toFixed(2),
      maxLatency: Math.max(...latencies),
      minLatency: Math.min(...latencies),
      averageLatency: averageLatency.toFixed(2),
    };
  }

  const tracerouteData = await getTracerouteData(url);
  const uniqueTracerouteData = extractUniqueTracerouteData(tracerouteData);

  // if (uniqueTracerouteData && uniqueTracerouteData.length > 0) {
  //   for (const data of uniqueTracerouteData) {
  //     const response = await axios(`http://ip-api.com/json/${data.ipAddress}`);

  //     data.country = response.data.country;
  //     data.city = response.data.city;
  //     data.lat = response.data.lat;
  //     data.lon = response.data.lon;
  //   }
  // }

  function extractUniqueTracerouteData(data) {
    const uniqueHops = [];
    const seenHops = new Set();

    for (const item of data) {
      if (!seenHops.has(item.hop)) {
        seenHops.add(item.hop);
        uniqueHops.push(item);
      }
    }

    return uniqueHops;
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
