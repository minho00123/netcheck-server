const mongoose = require("mongoose");

const tracerouteDataSchema = new mongoose.Schema({
  hop: Number,
  ipAddress: String,
  elapsedTime: Number,
  country: String,
  city: String,
  lat: Number,
  lon: Number,
});

const urlInfoSchema = new mongoose.Schema({
  url: String,
  ipAddress: String,
  country: String,
  city: String,
});

const pingResultSchema = new mongoose.Schema({
  sent: Number,
  received: Number,
  lossRate: Number,
});

const bandwidthResultSchema = new mongoose.Schema({
  totalMegabits: Number,
  durationInSeconds: Number,
  bandwidth: Number,
});

const trafficResultSchema = new mongoose.Schema({
  timestamp: String,
  dataSize: Number,
  url: String,
});

const resultSchema = new mongoose.Schema({
  customId: String,
  urlInfo: urlInfoSchema,
  pingData: pingResultSchema,
  createdAt: { type: Date, default: Date.now },
  trafficData: [trafficResultSchema],
  bandwidthData: bandwidthResultSchema,
  tracerouteData: [tracerouteDataSchema],
});

module.exports = mongoose.model("Result", resultSchema);
