const {
  processInformationData,
  processSecurityData,
  processReliabilityData,
  processSpeedData,
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
