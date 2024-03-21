const https = require("https");

function getAvailabilityData(url) {
  return new Promise((resolve, reject) => {
    const startTime = Date.now();

    if (url) {
      https.get(url, res => {
        const { statusCode } = res;
        const endTime = Date.now();
        const responseTime = endTime - startTime;

        resolve({ statusCode, responseTime });
      });
    }
  });
}

module.exports = getAvailabilityData;
