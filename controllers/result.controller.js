const { processResult } = require("../services/result");

exports.postResult = async (req, res) => {
  try {
    const result = await processResult(req);

    res.status(200).send(result);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Server Error", error: error.message });
  }
};
