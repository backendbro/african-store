// const nodemailer = require("nodemailer");
const {
  welcomeEmailTemplate,
  workerEmailTemplate,
} = require("../email-views/index");
const { Resend } = require("resend");

// let transporter = nodemailer.createTransport({
//   host: "smtp.elasticemail.com",
//   port: 2525,
//   auth: {
//     user: "no-reply.donicoin@gmail.com",
//     pass: "BB1323D5EE41C254D19BDEEE0BDC4E2950A0",
//   },
// });

// // Remember to refactor the payload code

// const sendEmail = async (to, subject) => {
//   let template;

//   if (subject == "Welcome") {
//     template = welcomeEmailTemplate;
//   }

//   const info = {
//     from: "Donicoin <nzubechukwuukagha@gmail.com>",
//     to,
//     subject,
//     html: template,
//   };

//   try {
//     const infos = await transporter.sendMail(info);
//     console.log(infos);
//   } catch (error) {
//     console.log(error);
//     return;
//   }
// };

const RESEND_API_KEY = process.env.RESEND_API_KEY;

const resend = new Resend(RESEND_API_KEY);

const sendEmail = async (userEmail, subject, adminName, message) => {
  let emailHtml;
  if (subject == "Welcome") {
    emailHtml = welcomeEmailTemplate({});
  } else if (subject == "Admin message") {
    emailHtml = workerEmailTemplate({ adminName, message });
  }

  try {
    const emails = await resend.emails.send({
      from: "African Market <onboarding@africanmarkets.eu>",
      to: userEmail,
      subject,
      html: emailHtml,
    });
    console.log(emails);
  } catch (error) {
    console.error(error);
  }
};

module.exports = { sendEmail };
