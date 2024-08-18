import FormData from 'form-data'
import Mailgun from 'mailgun.js'
import nodemailer from 'nodemailer'

import { IProduct, IOrder } from '@/interfaces'

import { toIDRFormat } from './currency'

export const generateOrderText = ({
  items,
  customer,
  totalPrice,
  orderId
}: {
  items: IProduct.IProductCart[]
  customer: IOrder.IOrdererInputForm
  totalPrice: number,
  orderId: string
}) => {
  const text =
    `Assalamualaikum, saya mau order.
  ${items
    .map((product, i) => {
      return `\n${i + 1}. *${product.name}*
    Quantity: ${product.quantity}
    Harga (@): ${toIDRFormat(product.price)}
    Total Harga: ${toIDRFormat(product.price * product.quantity)}`
    })
    .join(' ')}` +
    `\n\nTotal : *${toIDRFormat(totalPrice)}*` +
    `\n\n*Pengiriman* : ${customer.address}\n` +
    '--------------------------------' +
    '\n*Nama :*' +
    `\n${customer.name} ( ${customer.phoneNumber} )` +
    '\n\n*Alamat :*' +
    `\n${customer.address}` +
    '--------------------------------' +
    `\nHalaman order: https://https://bafkitchen.posku.online/orders/${orderId}`

  return text  
}

export const sendEmail = ({
  recipientEmail,
  subject,
  text,
}: {
  recipientEmail: string
  subject: string
  text: string
}) => {
  const mailgun = new Mailgun(FormData)

  console.log({ key: process.env.MAILGUN_API_KEY})
  const mg = mailgun.client({
    username: 'api',
    key: process.env.MAILGUN_API_KEY || 'key-yourkeyhere'
  })

  mg.messages
    .create('sandboxf64892e46fe9437f954fc7049ae52ad6.mailgun.org', {
      from: 'Admin Bafkitchen <mailgun@sandboxf64892e46fe9437f954fc7049ae52ad6.mailgun.org>',
      to: recipientEmail,
      bcc: ['kubido@gmail.com', 'nurlikacahyani@gmail.com'],
      subject,
      text,
    })
    .then((msg) => console.log(msg)) // logs response data
    .catch((err) => console.log(err)) // logs any error
}


export async function sendGmail({
  recipientEmail,
  subject,
  text,
}: {
  recipientEmail: string
  subject: string
  text: string
}){

 
  // Create a transporter object using SMTP transport
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: "bafkitchen.notification",
      pass: "hjkv efvx dqbg cjox",
    },
  });

  // Define the email options
  const mailOptions = {
    from: process.env.GMAIL_USER,
    to: recipientEmail,
    bcc: ['kubido@gmail.com', 'nurlikacahyani@gmail.com'],
    subject,
    text,
  };

  try {
    await transporter.sendMail(mailOptions);
    return { message: 'Email sent successfully' }
  } catch (error) {
    console.error('Error sending email:', error);
    return { message: 'Error sending email' }
  }
}
