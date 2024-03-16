const raw = require("raw-socket");

function createICMPPacket(sequenceNumber) {
  const header = Buffer.alloc(8);

  header.writeUInt8(8, 0);
  header.writeUInt8(0, 1);
  header.writeUInt16BE(0, 2);
  header.writeUInt16BE(process.pid & 0xffff, 4);
  header.writeUInt16BE(sequenceNumber, 6);

  let checksum = 0;

  for (let i = 0; i < header.length; i += 2) {
    checksum += header.readUInt16BE(i);
  }

  checksum = (checksum >> 16) + (checksum & 0xffff);
  checksum += checksum >> 16;
  checksum = ~checksum & 0xffff;

  header.writeUInt16BE(checksum, 2);

  return header;
}

function ping(target, count, timeout = 1000) {
  return new Promise((resolve, reject) => {
    const socket = raw.createSocket({ protocol: raw.Protocol.ICMP });
    const sendTimes = {};
    const timeoutHandlers = {};
    let receivedCount = 0;
    let sequenceNumber = 0;

    socket.on("message", (buffer, source, info) => {
      const identifier = buffer.readUInt16BE(24);
      const seqNumber = buffer.readUInt16BE(26);

      if (identifier === process.pid && sendTimes[seqNumber]) {
        receivedCount++;
        clearTimeout(timeoutHandlers[seqNumber]);

        delete sendTimes[seqNumber];
        delete timeoutHandlers[seqNumber];
      }
    });

    const interval = setInterval(() => {
      if (sequenceNumber >= count) {
        clearInterval(interval);
        setTimeout(() => {
          const lossRate = ((count - receivedCount) / count) * 100;

          socket.close();
          resolve({ sent: count, received: receivedCount, lossRate });
        }, timeout);
        return;
      }

      sequenceNumber++;

      const packet = createICMPPacket(sequenceNumber);

      sendTimes[sequenceNumber] = Date.now();

      socket.send(packet, 0, packet.length, target, (err, bytes) => {
        if (err) {
          console.error(err);
        }
      });

      timeoutHandlers[sequenceNumber] = setTimeout(() => {
        delete sendTimes[sequenceNumber];
        delete timeoutHandlers[sequenceNumber];
      }, timeout);
    }, 1000);
  });
}

module.exports = ping;
