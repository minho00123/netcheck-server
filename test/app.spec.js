const request = require("supertest");
const app = require("../app");

jest.mock("../models/Result", () => ({
  collection: {
    find: jest.fn().mockReturnThis(),
    toArray: jest.fn().mockResolvedValue([
      {
        customId: "12345",
        url: "https://www.example.com",
        serverRegion: "Seoul",
        createdAt: new Date(),
        informationData: {
          registrar: "Registrar",
          registerExpiryDate: "2024/01/01",
          ipAddress: "8.8.8.8",
          city: "Seoul",
          country: "South Korea",
        },
        securityData: {
          hsts: "max-age=63072000;",
          csp: "default-src 'self'",
          issuer: "Issuer",
          expiryDate: "2024/01/01",
        },
        reliabilityData: {
          statusCode: 200,
          responseTime: 100,
          sent: 100,
          received: 100,
          lossRate: 0,
          latencies: [10, 20, 30],
        },
        speedData: {
          bandwidth: 1000,
          maxLatency: 30,
          minLatency: 10,
          averageLatency: 20,
        },
        tracerouteData: [
          {
            hop: 1,
            ipAddress: "8.8.8.8",
            elapsedTime: 10,
            country: "South Korea",
            city: "Seoul",
            lat: 10.1234,
            lon: -12.3456,
          },
          {
            hop: 2,
            ipAddress: "1.2.3.4",
            elapsedTime: 20,
            country: "US",
            city: "New York",
            lat: 20.1234,
            lon: -22.3456,
          },
        ],
      },
    ]),
  },
}));

jest.mock("nodemailer", () => ({
  createTransport: () => ({
    sendMail: jest.fn().mockResolvedValue({ messageId: "test" }),
  }),
}));

describe("app tests", () => {
  it("Should handle a request to the result route", async () => {
    const response = await request(app).post("/history/all");

    expect(response.statusCode).toBe(200);
  }, 10000);

  it("Should handle a request to the share route", async () => {
    const response = await request(app).post("/share");

    expect(response.statusCode).toBe(200);
  });
});
