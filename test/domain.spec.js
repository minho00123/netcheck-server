const getWhoisData = require("../src/domain");

jest.mock("net", () => ({
  connect: jest.fn(() => {
    const mockClient = {
      on: jest.fn(),
      write: jest.fn(),
      end: jest.fn(),
    };

    setTimeout(() => {
      mockClient.on.mock.calls.filter(call => call[0] === "data")[0][1](
        Buffer.from(
          "Registrar: ExampleRegistrar\nRegistry Expiry Date: 2024-01-01T00:00:00Z",
        ),
      );
    }, 100);

    return mockClient;
  }),
}));

describe("domain tests", () => {
  it("Should get registrar and expiry date from Whois data", async () => {
    const testUrl = "https://www.example.com";
    const data = await getWhoisData(testUrl);

    expect(data).toEqual({
      registrar: "ExampleRegistrar",
      registerExpiryDate: "01/01/2024",
    });
  });
});
