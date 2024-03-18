const express = require("express");
const router = express.Router();
const { getResult, postResult } = require("../controllers/result.controller");

router.get("/result/:id", getResult);
router.post("/result/:id", postResult);

module.exports = router;
