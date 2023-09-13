const sgMail = require("@sendgrid/mail");

//remove this function later
const sendMail = (template, emailTo) => {
  try {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    const msg = {
      to: emailTo,
      from: "nielsencintral.support@nielsen.com",
      subject: "TEST",
      text: "Plain text.",
      html: template,
    };
    sgMail
      .send(msg)
      .then(() => {
        console.log("email sent");
      })
      .catch((ex) => {
        console.error("email failed");
      });
  } catch (ex) {
    throw ex;
  }
};

const SendEmail = async (htmlBody, to, subject, cc) => {
  try {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    const msg = {
      to: to,
      cc: cc,
      from: "nielsencintral.support@nielsen.com",
      subject: subject ? subject : "",
      html: htmlBody,
    };
    await sgMail.send(msg);
  } catch (ex) {
    throw ex;
  }
};

const SendSpEmail = async (htmlBody, to, subject, cc) => {
  try {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    const msg = {
      to: to,
      cc: cc,
      from: "ci.workflow@smb.nielseniq.com",
      subject: subject ? subject : "",
      html: htmlBody,
    };
    await sgMail.send(msg);
  } catch (ex) {
    throw ex;
  }
};

module.exports = { sendMail: sendMail, SendEmail: SendEmail, SendSpEmail: SendSpEmail };
