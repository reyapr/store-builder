import { prisma } from "@/app/api/config";
import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { ICreateProductRequest } from "@/interfaces/product";

export async function GET(request: Request) {
  try {
    const products = await prisma.product.findMany({
      include: {
        categories: true,
        store: true
      },
      where: {
        store: {
          isDeleted: false
        }
      }
    });
    return NextResponse.json({ products }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const productRequest: ICreateProductRequest = await request.json();
  try {
    
    const product = await prisma.product.create({
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
          connect: productRequest.categoryIds.map((id: string) => ({ id }))
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