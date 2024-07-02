const mongoose = require("mongoose");
const { Schema } = mongoose;

const basicInformationSchema = new Schema({
  siteTitle: String,
  siteDescription: String,
  statusCode: Number,
  responseTime: Number,
});

const ipSchema = new Schema({
  ipv4: String,
  city: String,
  country: String,
  ipv6: String,
});

const domainSchema = new Schema({
  domainName: String,
  domainRegistrar: String,
  domainCreationDate: String,
  domainUpdatedDate: String,
  domainExpiryDate: String,
  nameServerOrganization: String,
  nameServers: [String],
});

const pingSchema = new Schema({
  inputHost: String,
  host: String,
  alive: Boolean,
  output: String,
  time: Number,
  times: [Number],
  min: String,
  max: String,
  avg: String,
  stddev: String,
  packetLoss: String,
  numeric_host: String,
});

const securitySchema = new Schema({
  subject: {
    country: String,
    state: String,
    location: String,
    organization: String,
    commonName: String,
  },
  issuer: {
    country: String,
    state: String,
    location: String,
    organization: String,
    commonName: String,
  },
  subjectaltname: [String],
  ocspServers: [String],
  caIssuers: [String],
  publicKey: String,
  publicKeySize: Number,
  validFrom: String,
  validTo: String,
  serialNumber: String,
});

const speedSchema = new Schema({
  bandwidth: String,
});

const tracerouteSchema = new Schema({
  hop: Number,
  ip: String,
  rtt1: String,
  country: String,
  city: String,
});

const resultSchema = new Schema({
  customId: String,
  url: String,
  createdAt: { type: Date, default: Date.now },
  data: {
    basicInformation: basicInformationSchema,
    ip: ipSchema,
    domain: domainSchema,
    speed: speedSchema,
    security: securitySchema,
    ping: pingSchema,
    traceroute: [tracerouteSchema],
  },
});

const Result = mongoose.model("Result", resultSchema);

module.exports = Result;
