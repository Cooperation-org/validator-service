import nodemailer from 'nodemailer'
import dotenv from 'dotenv'

dotenv.config()

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT as any, 10),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD
  },
  tls: {
    ciphers: 'SSLv3'
  }
})

interface EmailParams {
  to: string[]
  subject: string
  body: string
}

export const sendEmail = async ({ to, subject, body }: EmailParams): Promise<void> => {
  const mailOptions = {
    from: process.env.SES_FROM_EMAIL,
    to,
    subject,
    html: body
  }

  try {
    const info = await transporter.sendMail(mailOptions)
    console.log(`Email sent successfully: ${info.messageId}`)
  } catch (error: any) {
    console.error(`Failed to send email: ${error.message}`)
    throw new Error(`Failed to send email: ${error.message}`)
  }
}
