const main = require("../db");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");

describe("db.js tests", () => {
  let mongoServer;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    process.env.MONGODB_CONNECTION = mongoServer.getUri();
  });

  afterAll(async () => {
    delete process.env.MONGODB_CONNECTION;
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  it("Should connect to the database successfully", async () => {
    await expect(main()).resolves.toBeUndefined();
    expect(mongoose.connection.readyState).toBe(1);
  });
});
