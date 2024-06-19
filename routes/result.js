const express = require("express");
const router = express.Router();
const {
  postDataAll,
  postHistoryData,
  postHistoryIdData,
  postTracerouteData,
  postPingData,
} = require("../controllers/result.controller");

router.post("/result/all", postDataAll);
router.post("/result/ping", postPingData);
router.post("/result/traceroute", postTracerouteData);
router.post("/history/all", postHistoryData);
router.post("/history/id", postHistoryIdData);

module.exports = router;
