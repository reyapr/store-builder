import FormData from 'form-data'
import Mailgun from 'mailgun.js'
import nodemailer from 'nodemailer'

import { inngest } from './client'

export const sendEmail = inngest.createFunction(
  { id: 'Send Email' },
  { event: 'email/send' },
  async ({ event, step }) => {
    const { recipientEmail, subject, text } = event.data
    const { NODE_ENV, BCC_EMAILS_DEV, BCC_EMAILS_PROD} = process.env

    const bcc = (NODE_ENV === "production" ? BCC_EMAILS_PROD : BCC_EMAILS_DEV)?.split(",") || []
    
    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: recipientEmail,
      bcc,
      subject,
      text
    }

    await step.run('Send email', async () => {
      sendWithGmail(mailOptions)
    })

    return { success: true }
  }
)

export const sendWithMailgun = (mailOptions: MailOptions) => {
  const mailgun = new Mailgun(FormData)

  console.log({ key: process.env.MAILGUN_API_KEY })
  const mg = mailgun.client({
    username: 'api',
    key: process.env.MAILGUN_API_KEY || 'key-yourkeyhere'
  })

  mg.messages
    .create('sandboxf64892e46fe9437f954fc7049ae52ad6.mailgun.org', mailOptions)
    .then((msg) => console.log(msg)) // logs response data
    .catch((err) => console.log(err)) // logs any error
}

export async function sendWithGmail(mailOptions: MailOptions) {
  // Create a transporter object using SMTP transport
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'bafkitchen.notification',
      pass: 'uism tcci ggim ukmo'
    }
  })

  try {
    await transporter.sendMail(mailOptions)
    return { message: 'Email sent successfully' }
  } catch (error) {
    console.error('Error sending email:', error)
    return { message: 'Error sending email' }
  }
}

type MailOptions = {
  from: string | undefined // process.env.GMAIL_USER could be undefined, so we account for that
  to: string
  bcc: string[]
  subject: string
  text: string
}
