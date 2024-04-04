const getHttpHeaderData = require("../src/httpHeader");

jest.mock("https", () => ({
  get: jest.fn((url, callback) => {
    const mockResponse = {
      headers: {
        "strict-transport-security":
          "max-age=63072000; includeSubDomains; preload",
        "content-security-policy": "default-src 'self';",
      },
      on: jest.fn(),
    };

    callback(mockResponse);

    return {
      on: (event, listener) => {
        if (event === "error") listener(new Error("Network error"));
      },
    };
  }),
}));

describe("httpHeader tests", () => {
  it("Should get HSTS and CSP headers", async () => {
    const url = "https://www.example.com";
    const data = await getHttpHeaderData(url);

    expect(data).toHaveProperty(
      "hsts",
      "max-age=63072000; includeSubDomains; preload",
    );
    expect(data).toHaveProperty("csp", "default-src 'self';");
  });
});
