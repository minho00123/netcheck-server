const {
  postDataAll,
  postHistoryData,
  postHistoryIdData,
} = require("../controllers/result.controller");

jest.mock("../services/result", () => ({
  processDataAll: jest.fn(),
  processHistoryData: jest.fn(),
  processHistoryIdData: jest.fn(),
}));

describe("result controller tests", () => {
  it("postDataAll should send correct data and respond with 200", async () => {
    const mockReq = { body: { key: "value" } };
    const mockRes = { status: jest.fn().mockReturnThis(), send: jest.fn() };
    const mockData = { result: "data" };

    require("../services/result").processDataAll.mockResolvedValue(mockData);

    await postDataAll(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.send).toHaveBeenCalledWith(mockData);
  });

  it("postHistoryData should send correct data and respond with 200", async () => {
    const mockReq = { body: { key: "value" } };
    const mockRes = { status: jest.fn().mockReturnThis(), send: jest.fn() };
    const mockData = { result: "data" };

    require("../services/result").processHistoryData.mockResolvedValue(
      mockData,
    );

    await postHistoryData(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.send).toHaveBeenCalledWith(mockData);
  });

  it("postHistoryIdData should send correct data and respond with 200", async () => {
    const mockReq = { body: { key: "value" } };
    const mockRes = { status: jest.fn().mockReturnThis(), send: jest.fn() };
    const mockData = { result: "data" };

    require("../services/result").processHistoryIdData.mockResolvedValue(
      mockData,
    );

    await postHistoryIdData(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.send).toHaveBeenCalledWith(mockData);
  });
});
