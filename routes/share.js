const express = require("express");
const router = express.Router();
const { shareResult } = require("../controllers/share.controller");

router.post("/share", shareResult);

module.exports = router;
