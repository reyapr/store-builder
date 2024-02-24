import { prisma } from "@/app/api/config";
import { IUpdateStoreRequest } from "@/interfaces/store";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(request: Request, context: { params: any }) {
  const updateStoreRequest: IUpdateStoreRequest = await request.json();
  const { id } = context.params as { id: string };
  try {
    const store = await prisma.store.update({
      where: {
        id
      },
      data: {
        name: updateStoreRequest.name
      }
    });
    return NextResponse.json({ store }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 400 });
  }
}


export async function DELETE(_: NextRequest, context: { params: any }) {
  const { id } = context.params as { id: string };
  try {
    const existingStore = await prisma.store.findUnique({
      where: {
        id
      }
    })
    
    if (!existingStore) {
      return NextResponse.json({ error: 'Store does not exist' }, { status: 400 });
    }
    
    await prisma.store.update({
      where: {
        id
      },
      data: {
        isDeleted: true,
        name: `${existingStore.name}-deleted-${new Date().toISOString()}`
      }
    });
    return NextResponse.json({ message: 'Success to delete store'}, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 400 });
  }
}