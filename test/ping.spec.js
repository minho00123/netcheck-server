const raw = require("raw-socket");
const getPing = require("../src/ping");

jest.mock("raw-socket");
jest.useFakeTimers();

describe("ping tests", () => {
  it("Should get ping correctly", async () => {
    const mockSocket = {
      on: jest.fn(),
      send: jest.fn((packet, offset, length, target, callback) =>
        callback(null),
      ),
      close: jest.fn(),
    };

    raw.createSocket.mockReturnValue(mockSocket);

    const target = "8.8.8.8";
    const count = 5;
    const promise = getPing(target, count);

    for (let i = 1; i <= count; i++) {
      jest.advanceTimersByTime(1000);

      const messageCallback = mockSocket.on.mock.calls.find(
        call => call[0] === "message",
      )[1];
      const buffer = Buffer.alloc(48);

      buffer.writeUInt16BE(process.pid, 24);
      buffer.writeUInt16BE(i, 26);

      messageCallback(buffer);
    }

    jest.runAllTimers();

    const result = await promise;

    expect(raw.createSocket).toHaveBeenCalledWith({
      protocol: raw.Protocol.ICMP,
    });
    expect(mockSocket.send).toHaveBeenCalledTimes(count);
    expect(mockSocket.close).toHaveBeenCalled();
    expect(result.sent).toBe(count);
    expect(result.received).toBe(count);
    expect(result.lossRate).toBe(0);
    expect(result.latencies.length).toBe(count);
  });
});
