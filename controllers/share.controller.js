const { saveResult } = require("../services/share");

exports.shareResult = async (req, res) => {
  try {
    await saveResult(req.body);
    res.status(200).send("Save Succeeded");
  } catch (error) {
    console.error("Save Failed:", error);
    res.status(500).send("Save Failed");
  }
};
