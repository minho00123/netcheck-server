const raw = require("raw-socket");
const dns = require("node:dns");
const dgram = require("node:dgram");
const getTracerouteData = require("../src/traceroute"); // 가정: 이전에 제공된 코드가 traceroute.js 파일에 저장되어 있음

jest.mock("node:dgram");
jest.mock("raw-socket");
jest.mock("node:dns", () => {
  return {
    promises: {
      lookup: jest.fn(),
    },
  };
});

describe("traceroute tests", () => {
  it("Should get the traceroute data", async () => {
    const mockLookup = dns.promises.lookup;

    mockLookup.mockResolvedValue({ address: "8.8.8.8", family: 4 });

    const mockCreateSocket = jest.fn();

    dgram.createSocket = mockCreateSocket;

    const mockUdpSocket = {
      send: jest.fn(),
      setTTL: jest.fn(),
      close: jest.fn(),
      bind: jest.fn(callback => callback()),
    };

    mockCreateSocket.mockReturnValue(mockUdpSocket);

    const mockRawSocket = {
      on: jest.fn(),
      close: jest.fn(),
    };

    raw.createSocket.mockReturnValue(mockRawSocket);

    const resultPromise = getTracerouteData("www.example.com");

    jest.advanceTimersByTime(10000);

    const result = await resultPromise;

    expect(dns.promises.lookup).toHaveBeenCalledWith("www.example.com");
    expect(dgram.createSocket).toHaveBeenCalled();
    expect(raw.createSocket).toHaveBeenCalled();
    expect(result).toBeInstanceOf(Array);
  }, 20000);
});
