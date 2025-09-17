import nodemailer from "nodemailer";
import config from "../../../config";

const emailSender = async (email: string,subject:string, html: string) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: config.smtp_user,
      pass: config.smtp_pass
    },
    tls: {
      rejectUnauthorized: false,
    },
  });
  const info = await transporter.sendMail({
    from: '"Jareed" <azharmahmud730@gmail.com>',
    to: email,
    subject: subject,
    html,
  });
  return info;
};
export default emailSender;




