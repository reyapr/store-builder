import { prisma } from "@/app/api/config";
import { IUpdateOrderStatusApiRequest } from "@/interfaces/order";
import { NextResponse } from "next/server";

export async function PATCH(request: Request, context: { params: any }) {
  const orderStatusRequest: IUpdateOrderStatusApiRequest = await request.json();
  const { id } = context.params as { id: string };
  
  const order = await prisma.order.update({
    where: {
      id,
    },
    data: {
      status: orderStatusRequest.status,
    },
  });


  return NextResponse.json({ order, message: "Success to update order status" }, { status: 200});
}