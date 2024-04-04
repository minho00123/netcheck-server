const express = require("express");
const request = require("supertest");
const router = require("../routes/share");
const shareController = require("../controllers/share.controller");

jest.mock("../controllers/share.controller");

describe("routes/share.js tests", () => {
  it("Should route to shareResult", async () => {
    const app = express();

    app.use(express.json());
    app.use(router);

    shareController.shareResult.mockImplementation((req, res) =>
      res.status(200).send("Shared successfully"),
    );

    const response = await request(app).post("/share").send({ data: "test" });

    expect(response.statusCode).toBe(200);
    expect(response.text).toBe("Shared successfully");
    expect(shareController.shareResult).toHaveBeenCalled();
  });
});
