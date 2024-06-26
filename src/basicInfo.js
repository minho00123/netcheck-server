const axios = require("axios");

async function getBasicInfo(url) {
  try {
    const response = await axios.get(url);
    const html = response.data;
    const titleMatch = html.match(/<title>(.*?)<\/title>/);
    const descriptionMatch = html.match(
      /<meta name="description" content="(.*?)"/,
    );
    const siteTitle = titleMatch ? titleMatch[1] : "N/A";
    const siteDescription = descriptionMatch ? descriptionMatch[1] : "N/A";

    return { siteTitle, siteDescription };
  } catch (error) {
    console.error(error);
  }
}

module.exports = getBasicInfo;
