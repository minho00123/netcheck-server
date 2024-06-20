const axios = require("axios");
const {
  processInformationData,
  processSecurityData,
  processReliabilityData,
  processSpeedData,
  processTracerouteData,
  processHistoryData,
  processHistoryIdData,
} = require("../services/result");

exports.postDataAll = async function (req, res) {
  try {
    const informationData = await processInformationData(req.body);
    const securityData = await processSecurityData(req.body);
    const reliabilityData = await processReliabilityData(req.body);
    const speedData = await processSpeedData(req.body);
    const allData = {
      informationData,
      securityData,
      reliabilityData,
      speedData,
    };

    res.status(200).send(allData);
  } catch (error) {
    console.error(error);
  }
};

exports.postTracerouteData = async function (req, res) {
  try {
    const tracerouteData = await processTracerouteData(req.body);
    const uniqueTracerouteData = extractUniqueTracerouteData(tracerouteData);
    if (uniqueTracerouteData && uniqueTracerouteData.length > 0) {
      for (const data of uniqueTracerouteData) {
        const response = await axios(`http://ip-api.com/json/${data.ip}`);

        data.country = response.data.country;
        data.city = response.data.city;
        data.lat = response.data.lat;
        data.lon = response.data.lon;
      }
    }

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

    res.status(200).send(uniqueTracerouteData);
  } catch (error) {
    console.error(error);
  }
};

exports.postHistoryData = async function (req, res) {
  try {
    const data = await processHistoryData(req.body);

    res.status(200).send(data);
  } catch (error) {
    console.error(error);
  }
};

exports.postHistoryIdData = async function (req, res) {
  try {
    const data = await processHistoryIdData(req.body);

    res.status(200).send(data);
  } catch (error) {
    console.error(error);
  }
};
