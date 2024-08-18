import { NextResponse } from 'next/server'

import { prisma } from '@/app/api/config'
import { updateOrderStatusSchema } from '@/app/api/validator'
import { IUpdateOrderStatusApiRequest } from '@/interfaces/order'

export async function PATCH(request: Request, context: { params: any }) {
  const requestJson = await request.json()
  const updateOrderStatusReq = updateOrderStatusSchema.safeParse(requestJson)
  if (!updateOrderStatusReq.success) {
    return NextResponse.json(
      { error: updateOrderStatusReq.error },
      { status: 400 }
    )
  }

  const orderStatusRequest: IUpdateOrderStatusApiRequest =
    updateOrderStatusReq.data
  const { id } = context.params as { id: string }

  const order = await prisma.order.update({
    where: {
      id
    },
    data: {
      status: orderStatusRequest.status
    }
  })

  return NextResponse.json(
    { order, message: 'Success to update order status' },
    { status: 200 }
  )
}

export async function GET(request: Request, context: { params: any }) {
  const { id } = context.params as { id: string }

  const order = await prisma.order.findUnique({ where: { id }, include: {
    products: {
      include: {
        product: true
      }
    },
    store: true,
    customer: true
  } })
  if (!order) {
    return NextResponse.json(
      { error: 'Order does not exist' },
      { status: 400 }
    )
  }

  return NextResponse.json(order, { status: 200})
}
