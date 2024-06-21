const https = require("https");

function getSslData(url) {
  return new Promise((resolve, reject) => {
    const regex = /^(https?:\/\/)?/;
    const modifiedUrl = url.replace(regex, "");
    const options = {
      hostname: modifiedUrl,
      port: 443,
      method: "GET",
      rejectUnauthorized: false,
    };

    const req = https.request(options, res => {
      const cert = res.socket.getPeerCertificate();

      if (cert.issuer) {
        const sslData = { issuer: cert.issuer.O, expiryDate: cert.valid_to };

        resolve(sslData);
      } else {
        const error = new Error("SSL certificate not found");
        console.error("Error in getSslData:", error);
        reject(error);
      }
    });

    req.end();

    req.on("error", error => {
      console.error("Error in getSslData:", error);
      reject(error);
    });
  });
}

module.exports = getSslData;
