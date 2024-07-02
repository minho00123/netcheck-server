const getIpData = require("../src/ipAddress");
const getSslData = require("../src/ssl");
const getBasicInfo = require("../src/basicInfo");
const getWhoisData = require("../src/domain");
const calculateBandwidth = require("../src/bandwidth");
const getAvailabilityData = require("../src/availability");
const Result = require("../models/Result");
const Traceroute = require("nodejs-traceroute");
const Ping = require("ping");
const dnsPromises = require("node:dns").promises;

exports.processBasicInformationData = async function (body) {
  const { url } = body;
  const { siteTitle, siteDescription } = await getBasicInfo(url);
  const { statusCode, responseTime } = await getAvailabilityData(url);

  return {
    siteTitle,
    siteDescription,
    statusCode,
    responseTime,
  };
};

exports.processIpData = async function (body) {
  const { url } = body;
  const data = await getIpData(url);
  return data;
};

exports.processDomainData = async function (body) {
  const { url } = body;
  const data = await getWhoisData(url);
  return data;
};

exports.processSecurityData = async function (body) {
  const { url } = body;
  const data = await getSslData(url);
  return data;
};

exports.processReliabilityData = async function (body) {
  const { url } = body;
  const { statusCode, responseTime } = await getAvailabilityData(url);
  const reliabilityData = {
    statusCode,
    responseTime,
  };
  return reliabilityData;
};

exports.processSpeedData = async function (body) {
  const { url } = body;
  const { bandwidth } = await calculateBandwidth(url);
  const speedData = { bandwidth: bandwidth.toFixed(2) };
  return speedData;
};

async function getIpAddress(url) {
  try {
    const regex = /^(https?:\/\/)?/;
    const modifiedUrl = url.replace(regex, "");
    const { address } = await dnsPromises.lookup(modifiedUrl);
    return address;
  } catch (error) {
    console.error(error);
    return null;
  }
}

exports.processTracerouteData = async function (body) {
  const { url } = body;
  const ipAddress = await getIpAddress(url);

  if (!ipAddress) {
    throw new Error("Unable to resolve IP address for the URL.");
  }

  return new Promise((resolve, reject) => {
    const tracerouteData = [];
    const tracer = new Traceroute();
    let hopCount = 0;

    const hopHandler = hop => {
      hopCount++;
      tracerouteData.push(hop);
      if (hopCount >= 20) {
        tracer.removeListener("hop", hopHandler);
        resolve(tracerouteData);
      }
    };

    const closeHandler = code => {
      console.log(`Traceroute completed with code ${code}`);
      resolve(tracerouteData);
    };

    const errorHandler = err => {
      console.error("Traceroute error:", err);
      reject(err);
    };

    tracer.on("hop", hopHandler);
    tracer.on("close", closeHandler);
    tracer.on("error", errorHandler);
    tracer.trace(ipAddress);
  });
};

exports.processPingData = async function (body) {
  const { url } = body;
  const ipAddress = await getIpAddress(url);

  if (!ipAddress) {
    throw new Error("Unable to resolve IP address for the URL.");
  }

  const data = await Ping.promise.probe(ipAddress, {
    min_reply: 10,
  });

  return data;
};

exports.processSaveData = async function (body) {
  const saveData = await Result.create(body);

  return saveData;
};

exports.processHistoryIdData = async function (body) {
  const { customId } = body;
  const data = await Result.find({ customId });

  return data;
};

exports.processHistoryData = async function (body) {
  const { userId } = body;
  const data = await Result.find({ userId });

  return data;
};
