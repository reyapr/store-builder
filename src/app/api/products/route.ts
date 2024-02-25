import { prisma } from "@/app/api/config";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const stores = await prisma.product.findMany({
      include: {
        categories: true,
        store: true
      }
    });
    return NextResponse.json({ stores }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const productRequest = await request.json();
  try {
    
    const product = await prisma.product.create({
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
      },
    });
    return NextResponse.json({ product }, {
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