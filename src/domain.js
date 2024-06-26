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

function makeData(info, name) {
  const regex = new RegExp(`${name}: (.+)`);
  const match = info.match(regex);

  if (name.includes("Date")) {
    if (match) {
      const date = match[1].trim();
      const [year, month, day] = date.split("T")[0].split("-");

      return `${month}/${day}/${year}`;
    } else {
      return "N/A";
    }
  } else {
    return match ? match[1].trim() : "N/A";
  }
}

function getWhoisData(url) {
  return new Promise((resolve, reject) => {
    if (url) {
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

        const domainName = makeData(info, "Domain Name");
        const domainRegistrar = makeData(info, "Registrar");
        const domainCreationDate = makeData(info, "Creation Date");
        const domainUpdatedDate = makeData(info, "Updated Date");
        const domainExpiryDate = makeData(info, "Registry Expiry Date");
        const nameServerOrganization = makeData(info, "Registrar WHOIS Server");

        const nameServerRegex = /Name Server: (.+)/g;
        const nameServers = [];
        let match;

        while ((match = nameServerRegex.exec(data)) !== null) {
          nameServers.push(match[1]);
        }

        resolve({
          domainName,
          domainRegistrar,
          domainCreationDate,
          domainUpdatedDate,
          domainExpiryDate,
          nameServerOrganization,
          nameServers,
        });
      });
    }
  });
}

module.exports = getWhoisData;
