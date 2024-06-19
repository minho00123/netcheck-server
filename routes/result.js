const express = require("express");
const router = express.Router();
const {
  postDataAll,
  postHistoryData,
  postHistoryIdData,
} = require("../controllers/result.controller");

router.post("/result/all", postDataAll);
router.post("/history/all", postHistoryData);
router.post("/history/id", postHistoryIdData);

module.exports = router;
