const getIpData = require("../src/ipAddress");
const getSslData = require("../src/ssl");
const getWhoisData = require("../src/domain");
const getHttpHeaderData = require("../src/httpHeader");
const calculateBandwidth = require("../src/bandwidth");
const getAvailabilityData = require("../src/availability");
const Result = require("../models/Result");
const dnsPromises = require("node:dns").promises;

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

exports.processInformationData = async function (req, res) {
  const { customId, url, serverRegion } = req;
  const { ipAddress, city, country } = await getIpData(url);
  const { registrar, registerExpiryDate } = await getWhoisData(url);
  const informationData = {
    registrar,
    registerExpiryDate,
    ipAddress,
    city,
    country,
  };
  const result = new Result({
    customId,
    url,
    serverRegion,
    informationData,
  });

  await result.save();

  return informationData;
};

exports.processSecurityData = async function (req, res) {
  const { customId, url } = req;
  const { hsts, csp } = await getHttpHeaderData(url);
  const { issuer, expiryDate } = await getSslData(url);
  const securityData = {
    hsts,
    csp,
    issuer,
    expiryDate,
  };

  await Result.findByIdAndUpdate(customId, { securityData }, { new: true });

  return securityData;
};

exports.processReliabilityData = async function (req, res) {
  const { customId, url } = req;
  const { statusCode, responseTime } = await getAvailabilityData(url);
  const reliabilityData = {
    statusCode,
    responseTime,
  };

  await Result.findByIdAndUpdate(customId, { reliabilityData }, { new: true });

  return reliabilityData;
};

exports.processSpeedData = async function (req, res) {
  const { customId, url } = req;
  const { bandwidth } = await calculateBandwidth(url);
  const speedData = { bandwidth: bandwidth.toFixed(2) };

  await Result.findByIdAndUpdate(customId, { speedData }, { new: true });

  return speedData;
};

exports.processHistoryData = async function (req, res) {
  const { url } = req;
  const historyData = await Result.collection.find({ url }).toArray();

  return historyData;
};

exports.processHistoryIdData = async function (req, res) {
  const { customId } = req;
  const historyData = await Result.collection.find({ customId }).toArray();

  return historyData;
};
