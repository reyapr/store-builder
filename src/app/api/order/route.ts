import { prisma } from "@/app/api/config";
import { EOrderStatus } from "@/constants/order";
import { IOrderRequest } from "@/interfaces/order";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const orderRequest: IOrderRequest = await request.json();
  try {
    const store = await prisma.store.findFirst({
      where: {
        name: orderRequest.storeName,
        isDeleted: false
      }
    })
    
    if (!store) {
      return NextResponse.json({ error: 'Store does not exist' }, { status: 400 });
    }
    
    let customer = await prisma.customer.findUnique({
      where: {
        phoneNumber: orderRequest.orderer.phoneNumber
      }
    })
    
    if(!customer) {
      customer = await prisma.customer.create({
        data: {
          name: orderRequest.orderer.name,
          phoneNumber: orderRequest.orderer.phoneNumber,
          address: orderRequest.orderer.address,
        }
      })
    }
    
    const order = await prisma.order.create({
      data: {
        total: orderRequest.totalPrice,
        customer: {
          connect: {
            id: customer.id
          }
        },
        products: {
          create: orderRequest.items.map((item) => {
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
            id: store.id
          }
        }
      }
    })
    
    return NextResponse.json({ order, message: 'Success to order' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}