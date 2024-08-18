import { IProduct, IOrder } from "@/interfaces"

import { toIDRFormat } from "./currency"

export const redirectToWA = ({
  items,
  order,
  totalCartPrice,
  waPhoneNumber
}: {
  items: IProduct.IProductCart[],
  order: IOrder.IOrdererInputForm,
  totalCartPrice: number,
  waPhoneNumber: string
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
    `\n\nTotal : *${toIDRFormat(totalCartPrice)}*` +
    `\n\n*Pengiriman* : ${order.address}\n` +
    '--------------------------------' +
    '\n*Nama :*' +
    `\n${order.name} ( ${order.phoneNumber} )` +
    '\n\n*Alamat :*' +
    `\n${order.address}` +
    `\nVia ${location.origin}`

  const waUrl = `https://wa.me/${waPhoneNumber}?text=${encodeURI(text)}`
  window.location.replace(waUrl)
}