const getIpData = require("../src/ipAddress");
const getSslData = require("../src/ssl");
const getWhoisData = require("../src/domain");
const getHttpHeaderData = require("../src/httpHeader");
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
