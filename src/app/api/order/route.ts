import { prisma } from "@/app/api/config";
import { EOrderStatus } from "@/constants/order";
import { IOrderRequest } from "@/interfaces/order";
import { IProductCart } from "@/interfaces/product";
import { PrismaClient } from "@prisma/client/extension";
import { NextResponse } from "next/server";

const promiseUpdateStock = (trx: PrismaClient, items: IProductCart[]) =>
  Promise.all(
    items.map(async (item) => {
      const product = await trx.product.findUnique({
        where: {
          id: item.id,
        },
      });

      if (!product) {
        throw new Error("Product does not exist");
      }

      if (product.stock < item.quantity) {
        throw new Error(`Product ${product.name} out of stock`);
      }

      await trx.product.update({
        where: {
          id: item.id,
        },
        data: {
          stock: item.stock - item.quantity,
        },
      });
    })
  );

export async function POST(request: Request) {
  const orderRequest: IOrderRequest = await request.json();
  try {
    const store = await prisma.store.findFirst({
      where: {
        name: orderRequest.storeName,
        isDeleted: false,
      },
    });

    if (!store) {
      return NextResponse.json(
        { error: "Store does not exist" },
        { status: 400 }
      );
    }

    const order = await prisma.$transaction(async (trx) => {
      await promiseUpdateStock(trx, orderRequest.items);

      let customer = await trx.customer.findUnique({
        where: {
          phoneNumber: orderRequest.orderer.phoneNumber,
        },
      });

      if (!customer) {
        customer = await trx.customer.create({
          data: {
            name: orderRequest.orderer.name,
            phoneNumber: orderRequest.orderer.phoneNumber,
            address: orderRequest.orderer.address,
          },
        });
      }

      return trx.order.create({
        data: {
          total: orderRequest.totalPrice,
          customer: {
            connect: {
              id: customer!.id,
            },
          },
          products: {
            create: orderRequest.items.map((item) => {
              return {
                product: {
                  connect: {
                    id: item.id,
                  },
                },
                quantity: item.quantity,
              };
            }),
          },
          status: EOrderStatus.PENDING,
          store: {
            connect: {
              id: store.id,
            },
          },
        },
      });
    });

    return NextResponse.json(
      { order, message: "Success to order" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}


export async function GET() {
  const orders = await prisma.order.findMany({
    include: {
      customer: true,
      products: {
        include: {
          product: true,
        },
      },
      store: true,
    },
    where: {
      store: {
        isDeleted: false,
      }
    }
  });
  return NextResponse.json(orders, { status: 200 });
}
