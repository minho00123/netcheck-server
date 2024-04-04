const axios = require("axios");
const getPing = require("../src/ping");
const getIpData = require("../src/ipAddress");
const getSslData = require("../src/ssl");
const getWhoisData = require("../src/domain");
const getHttpHeaderData = require("../src/httpHeader");
const getTracerouteData = require("../src/traceroute");
const calculateBandwidth = require("../src/bandwidth");
const getAvailabilityData = require("../src/availability");
const Result = require("../models/Result");
const {
  processDataAll,
  processHistoryData,
  processHistoryIdData,
} = require("../services/result");

jest.mock("axios");
jest.mock("../src/ping");
jest.mock("../src/ipAddress");
jest.mock("../src/ssl");
jest.mock("../src/domain");
jest.mock("../src/httpHeader");
jest.mock("../src/traceroute");
jest.mock("../src/bandwidth");
jest.mock("../src/availability");
jest.mock("../models/Result");

axios.mockImplementation(() =>
  Promise.resolve({
    data: {
      country: "South Korea",
      city: "Seoul",
      lat: "37.564214",
      lon: "127.001699",
    },
  }),
);

describe("processDataAll function", () => {
  it("Should process all data correctly", async () => {
    getWhoisData.mockResolvedValue({
      registrar: "Registrar",
      registerExpiryDate: "2024/01/01",
    });

    getIpData.mockResolvedValue({
      ipAddress: "8.8.8.8",
      city: "Seoul",
      country: "South Korea",
    });

    getHttpHeaderData.mockResolvedValue({
      hsts: "max-age=63072000;",
      csp: "default-src 'self';",
    });

    getSslData.mockResolvedValue({
      issuer: "Issuer",
      expiryDate: "2024/01/01",
    });

    getAvailabilityData.mockResolvedValue({
      statusCode: 200,
      responseTime: 100,
    });

    getPing.mockResolvedValue({
      sent: 10,
      received: 10,
      lossRate: 0,
      latencies: 10,
    });

    calculateBandwidth.mockResolvedValue({
      bandwidth: 1.7,
    });

    getTracerouteData.mockResolvedValue([
      {
        hop: 1,
        ipAddress: "8.8.8.8",
        elapsedTime: 10,
      },
    ]);

    const req = {
      body: { id: "1", url: "https://www.example.com", serverRegion: "Seoul" },
    };
    const res = {};
    const result = await processDataAll(req, res);

    expect(result.informationData.registrar).toEqual("Registrar");
    expect(result.informationData.registerExpiryDate).toEqual("2024/01/01");
    expect(result.informationData.ipAddress).toEqual("8.8.8.8");
    expect(result.informationData.city).toEqual("Seoul");
    expect(result.informationData.country).toEqual("South Korea");

    expect(result.securityData.hsts).toEqual("max-age=63072000;");
    expect(result.securityData.csp).toEqual("default-src 'self';");
    expect(result.securityData.issuer).toEqual("Issuer");
    expect(result.securityData.expiryDate).toEqual("2024/01/01");

    expect(result.reliabilityData.statusCode).toEqual(200);
    expect(result.reliabilityData.responseTime).toEqual(100);
    expect(result.reliabilityData.sent).toEqual(10);
    expect(result.reliabilityData.received).toEqual(10);
    expect(result.reliabilityData.lossRate).toEqual(0);
    expect(result.reliabilityData.latencies).toEqual(10);
  });

  it("Should process history data based on URL", async () => {
    const mockData = [
      { id: 1, url: "https://www.example.com", data: "example data" },
    ];

    Result.collection.find.mockReturnValue({
      toArray: jest.fn().mockResolvedValue(mockData),
    });

    const req = { body: { url: "https://www.example.com" } };

    const historyData = await processHistoryData(req);

    expect(historyData).toEqual(mockData);
    expect(Result.collection.find).toHaveBeenCalledWith({
      url: "https://www.example.com",
    });
  });

  it("Should process history data based on customId", async () => {
    const mockData = [{ id: 1, customId: "12345", data: "example data" }];
    Result.collection.find.mockReturnValue({
      toArray: jest.fn().mockResolvedValue(mockData),
    });

    const req = { body: { customId: "12345" } };

    const historyData = await processHistoryIdData(req);

    expect(historyData).toEqual(mockData);
    expect(Result.collection.find).toHaveBeenCalledWith({ customId: "12345" });
  });
});
