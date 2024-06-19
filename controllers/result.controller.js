const {
  processDataAll,
  processHistoryData,
  processHistoryIdData,
  processTracerouteData,
  processPingData,
} = require("../services/result");

exports.postDataAll = async function (req, res) {
  try {
    const data = await processDataAll(req);

    res.status(200).send(data);
  } catch (error) {
    console.error(error);
  }
};

exports.postHistoryData = async function (req, res) {
  try {
    const data = await processHistoryData(req);

    res.status(200).send(data);
  } catch (error) {
    console.error(error);
  }
};

exports.postHistoryIdData = async function (req, res) {
  try {
    const data = await processHistoryIdData(req);

    res.status(200).send(data);
  } catch (error) {
    console.error(error);
  }
};

exports.postPingData = async function (req, res) {
  try {
    const data = await processPingData(req);

    res.status(200).send(data);
  } catch (error) {
    console.error(error);
  }
};

exports.postTracerouteData = async function (req, res) {
  try {
    const data = await processTracerouteData(req);

    res.status(200).send(data);
  } catch (error) {
    console.error(error);
  }
};
