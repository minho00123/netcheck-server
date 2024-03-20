const express = require("express");
const router = express.Router();
const {
  postSpeedData,
  postSecurityData,
  postTracerouteData,
  postInformationData,
  postReliabilityData,
} = require("../controllers/result.controller");

router.post("/result/speed", postSpeedData);
router.post("/result/security", postSecurityData);
router.post("/result/traceroute", postTracerouteData);
router.post("/result/information", postInformationData);
router.post("/result/reliability", postReliabilityData);

module.exports = router;
