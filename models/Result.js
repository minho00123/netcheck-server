const mongoose = require("mongoose");
const { Schema } = mongoose;

const basicInformationSchema = new Schema({
  responseTime: Number,
  siteDescription: String,
  siteTitle: String,
  statusCode: Number,
});

const ipSchema = new Schema({
  ipv4: String,
  ipv6: String,
  city: String,
  country: String,
});

const domainSchema = new Schema({
  domainCreationDate: String,
  domainExpiryDate: String,
  domainName: String,
  domainRegistrar: String,
  domainUpdatedDate: String,
  nameServerOrganization: String,
  nameServers: [String],
});

const pingSchema = new Schema({
  alive: Boolean,
  avg: String,
  host: String,
  inputHost: String,
  max: String,
  min: String,
  numeric_host: String,
  output: String,
  packetLoss: String,
  stddev: String,
  time: Number,
  times: [Number],
});

const securitySchema = new Schema({
  caIssuers: [String],
  issuer: {
    country: String,
    state: String,
    location: String,
    organization: String,
    commonName: String,
  },
  ocspServers: [String],
  publicKey: String,
  publicKeySize: Number,
  serialNumber: String,
  subject: {
    country: String,
    state: String,
    location: String,
    organization: String,
    commonName: String,
  },
  subjectaltname: [String],
  validFrom: String,
  validTo: String,
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
