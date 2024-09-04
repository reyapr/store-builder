import { PrismaClient } from '@prisma/client/extension'
import { NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

import { prisma } from '@/app/api/config'
import { createOrderSchema } from '@/app/api/validator'
import { EOrderStatus } from '@/constants/order'
import { IOrderRequest } from '@/interfaces/order'
import { IProductCart } from '@/interfaces/product'
import { generateOrderHtmlEmail } from '@/utils/order'

const promiseUpdateStock = (trx: PrismaClient, items: IProductCart[]) =>
  Promise.all(
    items.map(async (item) => {
      const product = await trx.product.findUnique({
        where: {
          id: item.id
        }
      })

      if (!product) {
        throw new Error('Product does not exist')
      }

      if (product.stock < item.quantity) {
        throw new Error(`Product ${product.name} out of stock`)
      }

      await trx.product.update({
        where: {
          id: item.id
        },
        data: {
          stock: item.stock - item.quantity
        }
      })
    })
  )

export async function POST(request: Request) {
  const requestJson = await request.json()
  const createOrderReq = createOrderSchema.safeParse(requestJson)
  if (!createOrderReq.success) {
    return NextResponse.json({ error: createOrderReq.error }, { status: 400 })
  }

  const { storeName, orderer, items, totalPrice }: IOrderRequest =
    createOrderReq.data
  try {
    const store = await prisma.store.findFirst({
      where: {
        name: storeName,
        isDeleted: false
      }
    })

    const order = await prisma.$transaction(
      async (trx) => {
        await promiseUpdateStock(trx, items)

        let customer = await trx.customer.findUnique({
          where: {
            phoneNumber: orderer.phoneNumber
          }
        })

        if (!customer) {
          customer = await trx.customer.create({
            data: {
              name: orderer.name,
              email: orderer.email,
              phoneNumber: orderer.phoneNumber,
              address: orderer.address
            }
          })
        }

        const order = await trx.order.create({
          data: {
            total: totalPrice,
            customer: {
              connect: {
                id: customer!.id
              }
            },
            productOrders: {
              create: items.map((item) => {
                return {
                  product: {
                    connect: {
                      id: item.id
                    }
                  },
                  quantity: item.quantity
                }
              })
            },
            status: EOrderStatus.PENDING,
            store: {
              connect: {
                id: store?.id
              }
            }
          }
        })

        sendWithGmail({
          to: orderer.email,
          from: process.env.GMAIL_USER,
          subject: `Order #${order.number} berhasil dibuat`,
          html: generateOrderHtmlEmail({
            totalPrice,
            items,
            customer: orderer,
            orderId: order.id
          })
        })

        return order
      },
      { timeout: 20000, maxWait: 18000 }
    )

    return NextResponse.json(
      { order, message: 'Success to order' },
      { status: 200 }
    )
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    )
  }
}

export async function GET() {
  const orders = await prisma.order.findMany({
    include: {
      customer: true,
      productOrders: {
        include: {
          product: true
        }
      },
      store: true
    },
    where: {
      store: {
        isDeleted: false
      }
    }
  })
  return NextResponse.json(orders, { status: 200 })
}

async function sendWithGmail(mailOptions: MailOptions) {
  const { NODE_ENV, BCC_EMAILS_DEV, BCC_EMAILS_PROD } = process.env

  const bcc =
    (NODE_ENV === 'production' ? BCC_EMAILS_PROD : BCC_EMAILS_DEV)?.split(
      ','
    ) || []

  // Create a transporter object using SMTP transport
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'bafkitchen.notification',
      pass: 'uism tcci ggim ukmo'
    }
  })

  try {
    await transporter.sendMail({ ...mailOptions, bcc })
    console.log('Email sent successfully')
    return { message: 'Email sent successfully' }
  } catch (error) {
    console.error('Error sending email:', error)
    return { message: 'Error sending email' }
  }
}

type MailOptions = {
  from: string | undefined // process.env.GMAIL_USER could be undefined, so we account for that
  to: string
  subject: string
  html: string
}
