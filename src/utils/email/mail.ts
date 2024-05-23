import nodemailer from "nodemailer";
import * as ejs from "ejs";

interface Send {
  email: string;
  subject: string;
  template?: string;
  text?: string;
}

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  service: process.env.EMAIL_SERVICE,
  port: process.env.EMAIL_PORT,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
} as nodemailer.TransportOptions);

// async..await is not allowed in global scope, must use a wrapper
export async function send({ email, subject, template, text }: Send) {
  console.log(__dirname);
  let html;
  if (template) {
    ejs.renderFile(
      // C:\Users\intern7\Documents\github\backend\src\email
      `${__dirname}/../ejs/${template}.ejs`,
      {},
      function (err, data) {
        html = data;
      }
    );
  }
  // send mail with defined transport object
  const info = await transporter.sendMail({
    from: "Mindlift Wellness", // sender address
    to: email, // list of receivers
    subject, // Subject line
    html, // plain text body
    text, // plain text body
  });

  console.log("Message sent: %s", (info as any).messageId);
  // Message sent: <d786aa62-4e0a-070a-47ed-0b0666549519@ethereal.email>
}

// sendMail().catch(console.error);
