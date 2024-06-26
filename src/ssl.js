const https = require("https");

function extractSubjectAltNames(altnames) {
  const regex = /DNS:([^, ]+)/g;
  const dnsNames = [];
  let match;

  while ((match = regex.exec(altnames)) !== null) {
    dnsNames.push(match[1]);
  }

  return dnsNames;
}

function getSslData(url) {
  return new Promise((resolve, reject) => {
    const regex = /^(https?:\/\/)?/;
    const modifiedUrl = url.replace(regex, "");
    const options = {
      hostname: modifiedUrl,
      port: 443,
      method: "GET",
      rejectUnauthorized: false,
    };

    const req = https.request(options, res => {
      const cert = res.socket.getPeerCertificate();
      const sslTlsData = { subject: {}, issuer: {} };

      if (cert.subject) {
        sslTlsData.subject.country = cert.subject.C ? cert.subject.C : "N/A";
        sslTlsData.subject.state = cert.subject.ST ? cert.subject.ST : "N/A";
        sslTlsData.subject.location = cert.subject.L ? cert.subject.L : "N/A";
        sslTlsData.subject.organization = cert.subject.O
          ? cert.subject.O
          : "N/A";
        sslTlsData.subject.commonName = cert.subject.CN
          ? cert.subject.CN
          : "N/A";
      }

      if (cert.issuer) {
        sslTlsData.issuer.country = cert.issuer.C ? cert.issuer.C : "N/A";
        sslTlsData.issuer.state = cert.issuer.ST ? cert.issuer.ST : "N/A";
        sslTlsData.issuer.location = cert.issuer.L ? cert.issuer.L : "N/A";
        sslTlsData.issuer.organization = cert.issuer.O ? cert.issuer.O : "N/A";
        sslTlsData.issuer.commonName = cert.issuer.CN ? cert.issuer.CN : "N/A";
      }

      if (cert.subjectaltname) {
        const subjectAltNames = extractSubjectAltNames(cert.subjectaltname);

        sslTlsData.subjectaltname = subjectAltNames ? subjectAltNames : "N/A";
      }

      if (cert.infoAccess) {
        sslTlsData.ocspServers = cert.infoAccess["OCSP - URI"]
          ? cert.infoAccess["OCSP - URI"]
          : "N/A";
        sslTlsData.caIssuers = cert.infoAccess["CA Issuers - URI"]
          ? cert.infoAccess["CA Issuers - URI"]
          : "N/A";
      }

      if (cert.pubkey) {
        const modifiedPubkey = cert.pubkey.toString("hex");

        sslTlsData.publicKey = modifiedPubkey ? modifiedPubkey : "N/A";
      }

      if (cert.bits) {
        sslTlsData.publicKeySize = cert.bits ? cert.bits : "N/A";
      }

      if (cert.valid_from) {
        sslTlsData.validFrom = cert.valid_from ? cert.valid_from : "N/A";
      }

      if (cert.valid_to) {
        sslTlsData.validTo = cert.valid_to ? cert.valid_to : "N/A";
      }

      if (cert.serialNumber) {
        sslTlsData.serialNumber = cert.serialNumber ? cert.serialNumber : "N/A";
      }

      resolve(sslTlsData);
    });

    req.end();

    req.on("error", error => {
      console.error("Error in getSslData:", error);
      reject(error);
    });
  });
}

module.exports = getSslData;

getSslData("https://www.naver.com");
