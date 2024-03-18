const Result = require("../models/Result");
const nodemailer = require("nodemailer");

const sendEmail = async (email, url) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.NODEMAILER_EMAIL,
        pass: process.env.NODEMAILER_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: process.env.NODEMAILER_EMAIL,
      to: email,
      subject: "Network Information",
      text: `Your friend sent the network information of ${url}. \n Check out the Result! `,
    });

    return { success: true, message: "Email successfully sent." };
  } catch (error) {
    console.error("Error sending email: ", error);
    return { success: false, message: "Error sending email." };
  }
};

exports.saveResult = async function (data) {
  const result = new Result(data);

  try {
    const savedResult = await result.save();
    const url = "http://localhost:5173/result/" + data.customId;

    if ((savedResult && data.email, url)) {
      await sendEmail(data.email, url);
    }
  } catch (error) {
    console.error("Error saving result or sending email: ", error);
    res.status(500).send("Error saving result or sending email.");
  }
};
