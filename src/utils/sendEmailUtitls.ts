// import nodemailer from "nodemailer"
// import config from "../config";

// interface MailOptions {
//     from: string;
//     to: string;
//     subject: string;
//     html?: string;
// }

// const SendEmailUtility = async (
//     EmailTo: string,
//     EmailSubject: string,
//     HtmlContent: string
// ): Promise<any> => {

//     if (!config.smtp_host  || !config.smtp_port || !config.smtp_user || !config.smtp_pass) {
//       throw new Error("Missing SMTP configuration in environment variables");
//     }

//     let transporter = nodemailer.createTransport({
//         host: config.smtp_host,
//         port: config.smtp_port,
//         secure: true,
//         auth: {
//             user: config.smtp_user,
//             pass: config.smtp_pass
//         },
//         tls: { rejectUnauthorized: false }
//     } as any);

//     let mailOptions: MailOptions = {
//         from: `Programming Journey<${config.smtp_user}>`,
//         to: EmailTo,
//         subject: EmailSubject,
//         html: HtmlContent
//     };

//     return await transporter.sendMail(mailOptions);
// }

// export default SendEmailUtility;
