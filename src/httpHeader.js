const https = require("https");

function getHttpHeaderData(url) {
  return new Promise((resolve, reject) => {
    const info = {};

    if (url) {
      https
        .get(url, res => {
          if (res.headers["strict-transport-security"]) {
            info["hsts"] = res.headers["strict-transport-security"];
          }

          if (res.headers["content-security-policy"]) {
            info["csp"] = res.headers["content-security-policy"];
          }

          resolve(info);
        })
        .on("error", error => {
          console.error(error);
          reject(error);
        });
    } else {
      reject(new Error("URL is required"));
    }
  });
}

module.exports = getHttpHeaderData;
