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
    const regex = /^(https?:\/\/)?/;
    const modifiedUrl = url.replace(regex, "");
    const ipInfo = await getIpAddress(modifiedUrl);
    const { targetIp } = ipInfo;
    const locationResponse = await fetch(`http://ip-api.com/json/${targetIp}`);
    const locationInfo = await locationResponse.json();

    resolve({
      ipAddress: targetIp,
      city: locationInfo.city,
      country: locationInfo.country,
    });
  });
}

module.exports = getIpData;
