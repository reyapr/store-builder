import { prisma } from "@/app/api/config";
import { updateCategorySchema } from "@/app/api/validator";
import { NextResponse } from "next/server";

export async function PATCH(request: Request, context: { params: any }) {
  const requestJson = await request.json();
  const updateCategoryReq = updateCategorySchema.safeParse(requestJson);
  
  if (!updateCategoryReq.success) {
    return NextResponse.json({ error: updateCategoryReq.error }, { status: 400 });
  }
  
  const categoryRequest = updateCategoryReq.data;
  const { id } = context.params as { id: string };
  try {
    const store = await prisma.category.update({
      where: {
        id
      },
      data: {
        name: categoryRequest.name,
        store: {
          connect: {
            id: categoryRequest.storeId
          }
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
    const existingCategory = await prisma.category.findUnique({
      where: {
        id
      }
    })
    
    if (!existingCategory) {
      return NextResponse.json({ error: 'Category does not exist' }, { status: 400 });
    }
    
    await prisma.category.delete({
      where: {
        id
      }
    });
    return NextResponse.json({ message: 'Success to delete category'}, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 400 });
  }
}