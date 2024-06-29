const express = require("express");
const router = express.Router();
const {
  postBasicInformationData,
  postIpData,
  postPingData,
  postDomainData,
  postSecurityData,
  postReliabilityData,
  postSpeedData,
  postTracerouteData,
  postSaveData,
  postHistoryIdData,
  postHistoryData,
} = require("../controllers/result.controller");

router.post("/result/basicInformation", postBasicInformationData);
router.post("/result/ipData", postIpData);
router.post("/result/domain", postDomainData);
router.post("/result/security", postSecurityData);
router.post("/result/reliability", postReliabilityData);
router.post("/result/speed", postSpeedData);
router.post("/result/traceroute", postTracerouteData);
router.post("/result/ping", postPingData);
router.post("/history/save", postSaveData);
router.post("/history/id", postHistoryIdData);
router.post("/history/all", postHistoryData);

module.exports = router;
