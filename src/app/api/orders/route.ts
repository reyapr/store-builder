import { PrismaClient } from '@prisma/client/extension'
import { NextResponse } from 'next/server'

import { prisma } from '@/app/api/config'
import { createOrderSchema } from '@/app/api/validator'
import { EOrderStatus } from '@/constants/order'
import { IOrderRequest } from '@/interfaces/order'
import { IProductCart } from '@/interfaces/product'
import { generateOrderText, sendEmail } from '@/utils/order'

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

    const order = await prisma.$transaction(async (trx) => {
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

      return trx.order.create({
        data: {
          total: totalPrice,
          customer: {
            connect: {
              id: customer!.id
            }
          },
          products: {
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
              id: store?.id || 'app'
            }
          }
        }
      })
    })

    console.log("------------------1")
    sendEmail({
      recipientEmail: orderer.email,
      subject: 'Order berhasil dibuat',
      text: generateOrderText({
        totalPrice,
        items,
        customer: orderer
      })
    })
    console.log("------------------2")

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
      products: {
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
