import nodeMailer from "nodemailer";

/**
 *
 * @param to the email address of the recipient
 * @param subject the subject of the email
 * @param html the html content of the email => it'll be rendered as the body of the email and will get it from views
 *
 * @returns void
 * @description This function sends an email to the recipient with the specified subject and html content
 */

export default function sendEmail(to: string, subject: string, html: string) {
  try {
    const transporter = nodeMailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.NODEMAILER_EMAIL,
        pass: process.env.NODEMAILER_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.NODEMAILER_EMAIL,
      to,
      subject,
      html,
    };

    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.log(err);
      }
      console.log(info);
    });
  } catch (error) {
    console.log(error);
  }
}
