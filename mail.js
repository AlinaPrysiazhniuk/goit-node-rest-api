import nodemailer from "nodemailer";

const transport = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: process.env.MAILTRAP_USERNAME,
    pass: process.env.MAILTRAP_PASSWORD,
  },
});

// const message = {
//   to: "alinkaprisaizhnuyk@gmail.com",
//   from: "alinkaprisaizhnuyk@gmail.com",
//   subject: "sale",
//   html: `<h1 style="color: red">"Click for sale"</h1>`,
//   text: `Click for sale`,
// };

// transport.sendMail(message).then(console.log).catch(console.error);

function sendMail(message) {
  return transport.sendMail(message);
}

export default { sendMail };
