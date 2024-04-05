const mongoose = require("mongoose");

async function main() {
  const mongodbConnection = process.env.MONGODB_CONNECTION;

  if (!mongodbConnection) {
    console.error("MongoDB Connection is missing.");
    return;
  }

  try {
    await mongoose.connect(mongodbConnection);
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
}

main();

module.exports = main;
