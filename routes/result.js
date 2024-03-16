const express = require("express");
const router = express.Router();
const { postResult } = require("../controllers/result.controller");

router.post("/result", postResult);

module.exports = router;
