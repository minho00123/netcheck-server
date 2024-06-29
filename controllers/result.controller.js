const axios = require("axios");
const {
  processBasicInformationData,
  processIpData,
  processDomainData,
  processSecurityData,
  processReliabilityData,
  processSpeedData,
  processTracerouteData,
  processPingData,
  processSaveData,
  processHistoryIdData,
  processHistoryData,
} = require("../services/result");

exports.postBasicInformationData = async function (req, res) {
  try {
    const basicInformationData = await processBasicInformationData(req.body);

    res.status(200).send(basicInformationData);
  } catch (error) {
    console.error(error);
  }
};

exports.postIpData = async function (req, res) {
  try {
    const ipData = await processIpData(req.body);

    res.status(200).send(ipData);
  } catch (error) {
    console.error(error);
  }
};

exports.postDomainData = async function (req, res) {
  try {
    const informationData = await processDomainData(req.body);

    res.status(200).send(informationData);
  } catch (error) {
    console.error(error);
  }
};

exports.postSecurityData = async function (req, res) {
  try {
    const securityData = await processSecurityData(req.body);

    res.status(200).send(securityData);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error processing security data");
  }
};
exports.postReliabilityData = async function (req, res) {
  try {
    const reliabilityData = await processReliabilityData(req.body);

    res.status(200).send(reliabilityData);
  } catch (error) {
    console.error(error);
  }
};

exports.postSpeedData = async function (req, res) {
  try {
    const speedData = await processSpeedData(req.body);

    res.status(200).send(speedData);
  } catch (error) {
    console.error(error);
  }
};

exports.postTracerouteData = async function (req, res) {
  try {
    const tracerouteData = await processTracerouteData(req.body);

    if (tracerouteData) {
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

      res.status(200).send(uniqueTracerouteData);
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
  } catch (error) {
    console.error(error);
  }
};

exports.postPingData = async function (req, res) {
  try {
    const data = await processPingData(req.body);

    res.status(200).send(data);
  } catch (error) {
    console.error(error);
  }
};

exports.postSaveData = async function (req, res) {
  try {
    const data = await processSaveData(req.body);

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

exports.postHistoryData = async function (req, res) {
  try {
    const data = await processHistoryData(req.body);

    res.status(200).send(data);
  } catch (error) {
    console.error(error);
  }
};
