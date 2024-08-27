

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
    `\nHalaman order: https://bafkitchen.posku.online/orders/${orderId}`

  return text  
}

