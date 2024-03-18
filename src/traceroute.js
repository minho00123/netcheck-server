const raw = require("raw-socket");
const dgram = require("node:dgram");
const dnsPromises = require("node:dns").promises;

async function getIpAddress(url) {
  try {
    const { address, family } = await dnsPromises.lookup(url);
    const targetIp = address;
    const ipVersion = family;

    return { targetIp, ipVersion };
  } catch (error) {
    console.error(error);
  }
}

async function traceroute(url) {
  return new Promise(async (resolve, reject) => {
    const result = [];
    const timeouts = {};
    const timeoutResponses = {};
    const port = 33434;
    const maxHops = 30;
    let ttl = 1;
    let isUdpSocketClosed = false;
    let isIcmpSocketClosed = false;

    const { targetIp, ipVersion } = await getIpAddress(url);
    const udpSocket = dgram.createSocket(ipVersion === 6 ? "udp6" : "udp4");
    const icmpSocket = raw.createSocket({ protocol: raw.Protocol.ICMP });

    icmpSocket.on("message", (buffer, ip) => {
      const portHex = buffer.toString("hex").substr(100, 4);
      const portNumber = parseInt(portHex, 16);

      if (ip && port === portNumber) {
        clearTimeout(timeoutResponses[ttl - 1]);
        const elapsedTime = process.hrtime.bigint() - timeouts[ttl - 1];
        const data = {
          hop: ttl - 1,
          ipAddress: ip,
          elapsedTime: Number(elapsedTime) / 1000000,
        };

        result.push(data);

        if (ip === targetIp || ttl > maxHops) {
          clearTimeout(intervalId);
          if (!isUdpSocketClosed) {
            udpSocket.close();
            isUdpSocketClosed = true;
          }
          if (!isIcmpSocketClosed) {
            icmpSocket.close();
            isIcmpSocketClosed = true;
          }
          resolve(result);
        }
      }
    });

    function sendPacket() {
      if (ttl <= maxHops) {
        udpSocket.setTTL(ttl);
        udpSocket.send(Buffer.alloc(0), 0, 0, port, targetIp);
        timeouts[ttl] = process.hrtime.bigint();
        timeoutResponses[ttl] = setTimeout(() => {
          result.push({ hop: ttl, ipAddress: "Timeout", elapsedTime: -1 });
          if (ttl >= maxHops) {
            clearTimeout(intervalId);
            if (!isUdpSocketClosed) {
              udpSocket.close();
              isUdpSocketClosed = true;
            }
            if (!isIcmpSocketClosed) {
              icmpSocket.close();
              isIcmpSocketClosed = true;
            }
            resolve(result);
          }
        }, 500);
        ttl++;
      }
    }

    udpSocket.bind(sendPacket);

    const intervalId = setInterval(sendPacket, 200);
  });
}

module.exports = traceroute;
