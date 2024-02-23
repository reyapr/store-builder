import { prisma } from "@/app/api/config";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(_: NextRequest, context: { params: any }) {
  const { id } = context.params as { id: string };
  try {
    await prisma.store.update({
      where: {
        id
      },
      data: {
        isDeleted: true
      }
    });
    return NextResponse.json({ message: 'Success to delete store'}, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 400 });
  }
}