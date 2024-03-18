const axios = require("axios");
const WebSocket = require("ws");

const wss = new WebSocket.Server({ port: 8080 });

async function traffic(url) {
  try {
    const response = await axios.get(url);
    const dataSize = JSON.stringify(response.data).length;

    wss.clients.forEach(function each(client) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(
          JSON.stringify({
            timestamp: new Date().toISOString(),
            dataSize,
            url,
          }),
        );
      }
    });
  } catch (error) {
    console.error(
      `[${new Date().toISOString()}] Error fetching data from ${url}: ${error}`,
    );
  }
}

module.exports = traffic;
