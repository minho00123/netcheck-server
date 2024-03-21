const axios = require("axios");
const dnsPromises = require("node:dns").promises;

async function getIpAddress(url) {
  try {
    const { address } = await dnsPromises.lookup(url);

    return { targetIp: address };
  } catch (error) {
    console.error(error);

    return null;
  }
}

async function getIpData(url) {
  return new Promise(async (resolve, reject) => {
    if (url) {
      const regex = /^(https?:\/\/)?/;
      const modifiedUrl = url.replace(regex, "");
      const ipInfo = await getIpAddress(modifiedUrl);
      const { targetIp } = ipInfo;

      try {
        const locationResponse = await axios(
          `http://ip-api.com/json/${targetIp}`,
        );

        resolve({
          ipAddress: targetIp,
          city: locationResponse.data.city,
          country: locationResponse.data.country,
        });
      } catch (error) {
        console.error(error);
        return null;
      }
    }
  });
}

module.exports = getIpData;
