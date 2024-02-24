import { prisma } from "@/app/api/config";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const categories = await prisma.category.findMany();
    return NextResponse.json({ categories }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const { storeId, ...newCategory } = await request.json();
  try {
    const category = await prisma.category.create({
      data: { 
        ...newCategory ,
        store: {
          connect: {
            id: storeId
          }
        }
      },
      
    });
    return NextResponse.json({ category }, {
      status: 201,
    });
  } catch (error) {
    let status = 500
    if ((error as Error).message.includes('Unique constraint')) {
      status = 400
    } 
    return NextResponse.json({ error: (error as Error).message }, { status });
  }
}