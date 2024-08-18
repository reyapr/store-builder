import FormData from 'form-data'
import Mailgun from 'mailgun.js'

import { IProduct, IOrder } from '@/interfaces'

import { toIDRFormat } from './currency'

export const generateOrderText = ({
  items,
  customer,
  totalPrice,
}: {
  items: IProduct.IProductCart[]
  customer: IOrder.IOrdererInputForm
  totalPrice: number
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
    `\nVia ${location.origin}`

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
  const mg = mailgun.client({
    username: 'api',
    key: process.env.MAILGUN_API_KEY || 'key-yourkeyhere'
  })

  mg.messages
    .create('sandboxf64892e46fe9437f954fc7049ae52ad6.mailgun.org', {
      from: 'Admin Bafkitchen',
      to: recipientEmail,
      bcc: ['kubido@gmail.com'],
      subject,
      text,
    })
    .then((msg) => console.log(msg)) // logs response data
    .catch((err) => console.log(err)) // logs any error
}
