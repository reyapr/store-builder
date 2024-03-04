import { prisma } from "@/app/api/config";
import { ICreateProductRequest } from "@/interfaces/product";
import { NextResponse } from "next/server";

export async function PATCH(request: Request, context: { params: any }) {
  const productRequest: ICreateProductRequest = await request.json();
  const { id } = context.params as { id: string };
  try {
    const store = await prisma.product.update({
      where: {
        id
      },
      data: {
        name: productRequest.name,
        price: productRequest.price,
        stock: productRequest.stock,
        store: {
          connect: {
            id: productRequest.storeId
          }
        },
        categories: {
          set: productRequest.categoryIds.map((id: string) => ({ id }))
        }
      }
    });
    return NextResponse.json({ store }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 400 });
  }
}

export async function DELETE(_: Request, context: { params: any }) {
  const { id } = context.params as { id: string };
  try {
    const existingProduct = await prisma.product.findUnique({
      where: {
        id
      }
    })
    
    if (!existingProduct) {
      return NextResponse.json({ error: 'Product does not exist' }, { status: 400 });
    }
    
    await prisma.product.delete({
      where: {
        id
      }
    });
    return NextResponse.json({ message: 'Success to delete product'}, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 400 });
  }
}