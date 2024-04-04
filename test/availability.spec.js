const getAvailabilityData = require("../src/availability.js");

jest.mock("https", () => ({
  get: jest.fn((url, callback) => {
    const mockResponse = {
      statusCode: 200,
      on: (event, eventHandler) => {
        if (event === "data") eventHandler(JSON.stringify({}));
        if (event === "end") eventHandler();
      },
    };

    callback(mockResponse);

    return { on: () => {} };
  }),
}));

describe("availability test", () => {
  it("Should return status code and response time", async () => {
    const testUrl = "https://www.example.com";

    const data = await getAvailabilityData(testUrl);

    expect(data).toHaveProperty("statusCode", 200);
    expect(data).toHaveProperty("responseTime");
    expect(typeof data.responseTime).toBe("number");
  });
});
