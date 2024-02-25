import { prisma } from "@/app/api/config";
import { NextResponse } from "next/server";

export async function PATCH(request: Request, context: { params: any }) {
  const productRequest = await request.json();
  const { id } = context.params as { id: string };
  try {
    const store = await prisma.product.update({
      where: {
        id
      },
      data: {
        ...productRequest,
        store: {
          connect: {
            id: productRequest.storeId
          }
        },
        categories: {
          connect: productRequest.categoryIds.map((id: number) => ({ id }))
        }
      }
    });
    return NextResponse.json({ store }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 400 });
  }
}