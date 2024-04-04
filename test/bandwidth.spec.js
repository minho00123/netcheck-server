const https = require("https");
const calculateBandwidth = require("../src/bandwidth.js");

jest.mock("https", () => ({
  get: jest.fn((url, callback) => {
    const mockResponse = {
      on: (event, eventHandler) => {
        if (event === "data") {
          const chunk = new Buffer.alloc(1024);

          setTimeout(() => eventHandler(chunk), 10);
        }

        if (event === "end") {
          setTimeout(eventHandler, 20);
        }
      },
    };

    callback(mockResponse);

    return { on: jest.fn() };
  }),
}));

describe("bandwidth tests", () => {
  it("Should calculate bandwidth correctly", async () => {
    const testUrl = "https://www.example.com";
    const { totalMegabits, durationInSeconds, bandwidth } =
      await calculateBandwidth(testUrl);

    expect(totalMegabits).toBeCloseTo(0.0078125);
    expect(durationInSeconds).toBeGreaterThan(0);
    expect(bandwidth).toBeGreaterThan(0);
  });

  it("Should handle errors", async () => {
    https.get.mockImplementationOnce(() => ({
      on: (event, eventHandler) => {
        if (event === "error") {
          eventHandler(new Error("Network error"));
        }
      },
    }));

    await expect(calculateBandwidth("https://www.example.com")).rejects.toThrow(
      "Network error",
    );
  });
});
