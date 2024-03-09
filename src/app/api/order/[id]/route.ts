import { prisma } from "@/app/api/config";
import { updateOrderStatusSchema } from "@/app/api/validator";
import { IUpdateOrderStatusApiRequest } from "@/interfaces/order";
import { NextResponse } from "next/server";

export async function PATCH(request: Request, context: { params: any }) {
  const requestJson = await request.json();
  const updateOrderStatusReq = updateOrderStatusSchema.safeParse(requestJson);
  if (!updateOrderStatusReq.success) {
    return NextResponse.json({ error: updateOrderStatusReq.error }, { status: 400 });
  }
  
  const orderStatusRequest: IUpdateOrderStatusApiRequest = updateOrderStatusReq.data;
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