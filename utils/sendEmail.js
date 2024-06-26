const sgMail = require("@sendgrid/mail");
const exceptions = require("./exceptions");

//create account verification msg from email & otpCode
const createAccountVerificationMsg = (full_name, email, otp) => {
  return {
    to: email,
    from: { name: "SENVOTES", email: process.env.SENDGRID_FROM_EMAIL },
    templateId: process.env.SENDGRID_CODE_TEMPLATE,
    dynamicTemplateData: {
      otp: otp,
      full_name: full_name,
    },
  };
};

const createTestMessage = (email, full_name) => {
  return {
    to: email,
    from: { name: "SENVOTES", email: process.env.SENDGRID_FROM_EMAIL },
    subject: "SENVOTES test email",
    text: "This email api seems to work fine",
    html:
      "<html><h1> Hi " +
      full_name +
      " </h1> <p>If you receive this email, that means the email API works fine with Sendgrid!</p></html>",
  };
};

const testMailMsg = {
  to: "lawdanazoumi@gmail.com",
  from: { name: "SENVOTES", email: process.env.SENDGRID_FROM_EMAIL },
  templateId: process.env.SENDGRID_CODE_TEMPLATE,
  dynamicTemplateData: {
    otp: "123456",
    full_name: "Lawdan",
  },
};

//send email
const sendEmail = async (msg) => {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  return sgMail
    .send(msg)
    .then(() => {
      console.log("Email sent");
    })
    .catch((error) => {
      console.error("Error while sending email", error);
      throw new exceptions.SendgidException("Error while sending email");
    });
};

//send test mail
const sendTestMail = async (full_name, mail) => {
  const msg = createTestMessage(mail, full_name);
  await sendEmail(msg)
    .then(() => {
      console.log("Email sent");
    })
    .catch((error) => {
      console.error(error);
      throw new exceptions.SendgidException("Error while sending email");
    });
};

//send confirmation mail
const sendConfirmationMail = async (full_name, email, otp) => {
  const msg = createAccountVerificationMsg(full_name, email, otp);
  console.log("msg: ", msg);
  await sendEmail(msg)
    .then(() => {
      console.log("Email sent");
    })
    .catch((error) => {
      console.error(error);
      throw new exceptions.SendgidException("Error while sending email");
    });
};

module.exports = {
  createAccountVerificationMsg,
  sendConfirmationMail,
  sendTestMail,
  sendEmail,
};
