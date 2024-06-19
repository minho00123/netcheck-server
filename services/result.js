const getIpData = require("../src/ipAddress");
const getSslData = require("../src/ssl");
const getWhoisData = require("../src/domain");
const getHttpHeaderData = require("../src/httpHeader");
const calculateBandwidth = require("../src/bandwidth");
const getAvailabilityData = require("../src/availability");
const getPing = require("../src/ping");
const getTracerouteData = require("../src/traceroute");
const axios = require("axios");
const Result = require("../models/Result");
const dnsPromises = require("node:dns").promises;

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
  const reliabilityData = {
    statusCode,
    responseTime,
  };

  const { bandwidth } = await calculateBandwidth(url);
  const speedData = { bandwidth: bandwidth.toFixed(2) };
  const result = new Result({
    customId: id,
    url,
    serverRegion,
    informationData,
    securityData,
    reliabilityData,
    speedData,
  });

  await result.save();

  return {
    informationData,
    securityData,
    reliabilityData,
    speedData,
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

exports.processPingData = async function (req, res) {
  const { url, count } = req.body;
  const ipAddress = await getIpAddress(url);
  const pingData = await getPing(ipAddress.targetIp, count);

  return pingData;
};

exports.processTracerouteData = async function (req, res) {
  const { url } = req.body;
  const ipAddress = await getIpAddress(url);
  const data = await getTracerouteData(ipAddress.targetIp);
  const tracerouteData = await changeTracerouteData(data);

  return tracerouteData;
};

async function getIpAddress(url) {
  try {
    const regex = /^(https?:\/\/)?/;
    const modifiedUrl = url.replace(regex, "");
    const { address, family } = await dnsPromises.lookup(modifiedUrl);

    return { targetIp: address, ipVersion: family };
  } catch (error) {
    console.error(error);
    return null;
  }
}

async function changeTracerouteData(tracerouteData) {
  const updatedData = await Promise.all(
    tracerouteData.map(async data => {
      const response = await axios(
        `http://ip-api.com/json/${data.ipAddress}?fields=status,message,country,city,lat,lon,query`,
      );

      return {
        ...data,
        country: response.data.country,
        city: response.data.city,
        lat: response.data.lat,
        lon: response.data.lon,
      };
    }),
  );

  return updatedData;
}
