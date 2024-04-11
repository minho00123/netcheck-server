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
  if (url) {
    const regex = /^(https?:\/\/)?/;
    const modifiedUrl = url.replace(regex, "");
    const ipInfo = await getIpAddress(modifiedUrl);

    if (ipInfo) {
      try {
        const { targetIp } = ipInfo;
        const locationResponse = await axios(
          `https://ip-api.com/json/${targetIp}`,
        );
        return {
          ipAddress: targetIp,
          city: locationResponse.data.city,
          country: locationResponse.data.country,
        };
      } catch (error) {
        console.error(error);
      }
    }
  }
}

module.exports = getIpData;
