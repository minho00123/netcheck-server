const express = require("express");
const router = express.Router();
const {
  postInformationData,
  postSecurityData,
  postReliabilityData,
  postSpeedData,
  postTracerouteData,
  postPingData,
  postHistoryData,
  postHistoryIdData,
} = require("../controllers/result.controller");

router.post("/result/information", postInformationData);
router.post("/result/security", postSecurityData);
router.post("/result/reliability", postReliabilityData);
router.post("/result/speed", postSpeedData);
router.post("/result/traceroute", postTracerouteData);
router.post("/result/ping", postPingData);
router.post("/history/all", postHistoryData);
router.post("/history/id", postHistoryIdData);

module.exports = router;
