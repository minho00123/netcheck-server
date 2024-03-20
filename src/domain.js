const net = require("net");
const whoisServers = require("./servers.json");

function getTld(url) {
  const parts = url.split(".");

  return parts[parts.length - 1];
}

function getModifiedUrl(url) {
  const regex = /(?<=\/\/)(?:www\.)?([^\/?#]+)/;
  const match = url.match(regex);

  return match[1];
}

function getWhoisData(url) {
  return new Promise((resolve, reject) => {
    const tld = getTld(url);
    const modifiedUrl = getModifiedUrl(url);
    const whoisServer = whoisServers[tld]
      ? whoisServers[tld]
      : whoisServers[""];
    const server = whoisServer.host ? whoisServer.host : whoisServer;
    const query = whoisServer.query
      ? whoisServer.query.replace("$addr", modifiedUrl)
      : modifiedUrl + "\r\n";
    const client = net.connect({ host: server, port: 43 }, () => {
      client.write(query);
    });

    client.on("data", data => {
      const info = data.toString();
      const registrarRegex = /Registrar: (.+)/;
      const expiryDateRegex = /Registry Expiry Date: (.+)/;
      const registrarMatch = info.match(registrarRegex);
      const expiryDateMatch = info.match(expiryDateRegex);
      const registrar = registrarMatch ? registrarMatch[1].trim() : "Unknown";
      const date = expiryDateMatch ? expiryDateMatch[1].trim() : "Unknown";
      const [year, month, day] = date.split("T")[0].split("-");

      resolve({ registrar, registerExpiryDate: `${month}/${day}/${year}` });
    });
  });
}

module.exports = getWhoisData;
