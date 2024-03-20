const {
  processSpeedData,
  processSecurityData,
  processTracerouteData,
  processInformationData,
  processReliabilityData,
} = require("../services/result");

exports.postInformationData = async function (req, res) {
  try {
    const result = await processInformationData(req);

    res.status(200).send(result);
  } catch (error) {
    console.error(error);
  }
};

exports.postSecurityData = async function (req, res) {
  try {
    const result = await processSecurityData(req);

    res.status(200).send(result);
  } catch (error) {
    console.error(error);
  }
};

exports.postReliabilityData = async function (req, res) {
  try {
    const result = await processReliabilityData(req);

    res.status(200).send(result);
  } catch (error) {
    console.error(error);
  }
};

exports.postSpeedData = async function (req, res) {
  try {
    const result = await processSpeedData(req);

    res.status(200).send(result);
  } catch (error) {
    console.error(error);
  }
};

exports.postTracerouteData = async function (req, res) {
  try {
    const result = await processTracerouteData(req);

    res.status(200).send(result);
  } catch (error) {
    console.error(error);
  }
};
