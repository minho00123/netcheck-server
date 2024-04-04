const axios = require("axios");
const dnsPromises = require("node:dns").promises;
const getIpData = require("../src/ipAddress");

jest.mock("axios");
jest.mock("node:dns", () => ({
  promises: {
    lookup: jest.fn(),
  },
}));

describe("ipAddress tests", () => {
  it("Should fetch IP address and location data", async () => {
    dnsPromises.lookup.mockResolvedValue({ address: "8.8.8.8" });

    axios.mockResolvedValue({
      data: {
        city: "Seoul",
        country: "South Korea",
      },
    });

    const result = await getIpData("http://www.example.com");

    expect(dnsPromises.lookup).toHaveBeenCalledWith("www.example.com");
    expect(axios).toHaveBeenCalledWith("http://ip-api.com/json/8.8.8.8");
    expect(result).toEqual({
      ipAddress: "8.8.8.8",
      city: "Seoul",
      country: "South Korea",
    });
  });
});
