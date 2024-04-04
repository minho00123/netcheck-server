const shareService = require("../services/share");
const { shareResult } = require("../controllers/share.controller");

jest.mock("../services/share");

describe("share controller tests", () => {
  it("Should respond with 200 status code on success", async () => {
    const mockReq = { body: { key: "value" } };
    const mockRes = { status: jest.fn().mockReturnThis(), send: jest.fn() };

    shareService.saveResult.mockResolvedValue();

    await shareResult(mockReq, mockRes);

    expect(shareService.saveResult).toHaveBeenCalledWith(mockReq.body);
    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.send).toHaveBeenCalledWith("Save Succeeded");
  });

  it("Should respond with 500 status code on failure", async () => {
    const mockReq = { body: { key: "value" } };
    const mockRes = { status: jest.fn().mockReturnThis(), send: jest.fn() };

    shareService.saveResult.mockRejectedValue(new Error("Save failed"));

    await shareResult(mockReq, mockRes);

    expect(shareService.saveResult).toHaveBeenCalledWith(mockReq.body);
    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.send).toHaveBeenCalledWith("Save Failed");
  });
});
