var nodemailer = require("nodemailer");

function createTransport() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

async function sendMail(mail) {
  var transport = createTransport();
  return transport.sendMail(mail);
}

module.exports = {
  sendMail,
};
