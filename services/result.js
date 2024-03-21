const axios = require("axios");
const getPing = require("../src/ping");
const getIpData = require("../src/ipAddress");
const getSslData = require("../src/ssl");
const getWhoisData = require("../src/domain");
const getTracerouteData = require("../src/traceroute");
const getHttpHeaderData = require("../src/httpHeader");
const calculateBandwidth = require("../src/bandwidth");
const getAvailabilityData = require("../src/availability");

exports.processInformationData = async function (req, res) {
  const { url } = req.body;
  const { registrar, registerExpiryDate } = await getWhoisData(url);
  const { ipAddress, city, country } = await getIpData(url);

  return { registrar, registerExpiryDate, ipAddress, city, country };
};

exports.processSecurityData = async function (req, res) {
  const { url } = req.body;
  const { hsts, csp } = await getHttpHeaderData(url);
  const { issuer, expiryDate } = await getSslData(url);

  return { issuer, expiryDate, hsts, csp };
};

exports.processReliabilityData = async function (req, res) {
  const { url } = req.body;
  const { ipAddress } = await getIpData(url);
  const { statusCode, responseTime } = await getAvailabilityData(url);
  const { sent, received, lossRate, latencies } = await getPing(ipAddress, 10);

  return { statusCode, responseTime, sent, received, lossRate, latencies };
};

exports.processSpeedData = async function (req, res) {
  const { url } = req.body;
  const { bandwidth } = await calculateBandwidth(url);

  return { bandwidth };
};

exports.processTracerouteData = async function (req, res) {
  const { url } = req.body;

  if (url) {
    const result = await getTracerouteData(url);

    for (const data of result) {
      const response = await axios(`http://ip-api.com/json/${data.ipAddress}`);

      data.country = response.data.country;
      data.city = response.data.city;
      data.lat = response.data.lat;
      data.lon = response.data.lon;
    }
    return result;
  }
};
