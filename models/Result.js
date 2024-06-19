const mongoose = require("mongoose");

const informationSchema = new mongoose.Schema({
  registrar: String,
  registerExpiryDate: String,
  ipAddress: String,
  city: String,
  country: String,
});

const securitySchema = new mongoose.Schema({
  hsts: String,
  csp: String,
  issuer: String,
  expiryDate: String,
});

const reliabilitySchema = new mongoose.Schema({
  statusCode: Number,
  responseTime: String,
});

const speedSchema = new mongoose.Schema({
  bandwidth: Number,
});

const pingSchema = new mongoose.Schema({
  sent: Number,
  received: Number,
  lossRate: Number,
  latencies: Array,
});

const resultSchema = new mongoose.Schema({
  customId: String,
  url: String,
  serverRegion: String,
  createdAt: { type: Date, default: Date.now },
  informationData: informationSchema,
  securityData: securitySchema,
  reliabilityData: reliabilitySchema,
  speedData: speedSchema,
  pingData: pingSchema,
});

module.exports = mongoose.model("Result", resultSchema);
