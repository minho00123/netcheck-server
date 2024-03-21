const https = require("https");

function calculateBandwidth(url) {
  return new Promise((resolve, reject) => {
    const startTime = Date.now();
    let totalBytes = 0;

    if (url) {
      const request = https.get(url, response => {
        response.on("data", chunk => {
          totalBytes += chunk.length;
        });

        response.on("end", () => {
          const endTime = Date.now();
          const durationInSeconds = (endTime - startTime) / 1000;
          const totalMegabits = (totalBytes * 8) / 1024 / 1024;
          const bandwidth = totalMegabits / durationInSeconds;

          resolve({ totalMegabits, durationInSeconds, bandwidth });
        });
      });

      request.on("error", error => {
        console.error(`Got error: ${error.message}`);
        reject(error);
      });
    }
  });
}

module.exports = calculateBandwidth;
