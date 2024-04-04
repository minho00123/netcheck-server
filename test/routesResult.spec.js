const express = require("express");
const request = require("supertest");
const router = require("../routes/result");
const resultController = require("../controllers/result.controller");

jest.mock("../controllers/result.controller");

describe("routes/result.js tests", () => {
  it("Should route to postDataAll", async () => {
    const app = express();

    app.use(express.json());
    app.use(router);

    resultController.postDataAll.mockImplementation((req, res) =>
      res.status(200).send("postDataAll"),
    );

    const response = await request(app).post("/result/all");

    expect(response.statusCode).toBe(200);
    expect(response.text).toBe("postDataAll");
    expect(resultController.postDataAll).toHaveBeenCalled();
  });

  it("Should route to postHistoryData", async () => {
    const app = express();

    app.use(express.json());
    app.use(router);

    resultController.postHistoryData.mockImplementation((req, res) =>
      res.status(200).send("postHistoryData"),
    );

    const response = await request(app).post("/history/all");

    expect(response.statusCode).toBe(200);
    expect(response.text).toBe("postHistoryData");
    expect(resultController.postHistoryData).toHaveBeenCalled();
  });

  it("Should route to postHistoryIdData", async () => {
    const app = express();

    app.use(express.json());
    app.use(router);

    resultController.postHistoryIdData.mockImplementation((req, res) =>
      res.status(200).send("postHistoryIdData"),
    );

    const response = await request(app).post("/history/id");

    expect(response.statusCode).toBe(200);
    expect(response.text).toBe("postHistoryIdData");
    expect(resultController.postHistoryIdData).toHaveBeenCalled();
  });
});
