const https = require("https");
const getSslData = require("../src/ssl");

jest.mock("https");

describe("ssl tests", () => {
  it("Should get issuer and expiryDate of the SSL certificate", async () => {
    const mockGetPeerCertificate = jest.fn().mockReturnValue({
      issuer: { O: "Issuer" },
      valid_to: "2024/01/01",
    });
    const mockRes = {
      socket: {
        getPeerCertificate: mockGetPeerCertificate,
      },
    };

    https.request.mockImplementation((options, callback) => {
      callback(mockRes);

      return {
        end: jest.fn(),
        on: jest.fn(),
      };
    });

    const result = await getSslData("https://www.example.com");

    expect(result).toEqual({
      issuer: "Issuer",
      expiryDate: "2024/01/01",
    });
  });
});
