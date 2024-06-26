const axios = require("axios");
const dnsPromises = require("dns").promises;

async function getIpAddress(url) {
  try {
    const { address } = await dnsPromises.lookup(url);
    return address;
  } catch (error) {
    console.error("Error fetching IPv4 address:", error);
    return null;
  }
}

async function getIPv6Address(url) {
  try {
    const { hostname } = new URL(url);
    const ipv6Addresses = await dnsPromises.resolve(hostname, "AAAA");
    return ipv6Addresses;
  } catch (error) {
    if (error.code === "ENODATA") {
      console.warn(`No IPv6 address found for hostname: ${url}`);
    } else {
      console.error("Error fetching IPv6 address:", error);
    }
    return [];
  }
}

async function getIpData(url) {
  const regex = /^(https?:\/\/)?/;
  const modifiedUrl = url.replace(regex, "");
  const ipData = {};

  const ipv4Address = await getIpAddress(modifiedUrl);
  if (ipv4Address) {
    try {
      const locationResponse = await axios(
        `http://ip-api.com/json/${ipv4Address}`,
      );
      ipData.ipv4 = ipv4Address;
      ipData.city = locationResponse.data.city;
      ipData.country = locationResponse.data.country;
    } catch (error) {
      console.error("Error fetching location for IPv4 address:", error);
    }
  }

  const ipv6Addresses = await getIPv6Address(url);
  if (ipv6Addresses.length > 0) {
    ipData.ipv6 = ipv6Addresses[0];
  }

  return ipData;
}

module.exports = getIpData;
