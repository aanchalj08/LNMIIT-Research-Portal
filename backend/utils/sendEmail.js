require("dotenv").config();
const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    auth: {
      user: process.env.SMP_EMAIL,
      pass: process.env.SMP_PASS,
    },
  });

  const message = {
    from: `LNMIIT Research Portal <21ucc126@lnmiit.ac.in>`,
    to: options.email,
    subject: options.subject,
    text: options.message, 
    html: options.html,  
  };

  try {
    const info = await transporter.sendMail(message);
    console.log(`Email sent: ${info.messageId}`);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

module.exports = sendEmail;
