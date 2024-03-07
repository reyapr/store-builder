import { prisma } from "@/app/api/config";
import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { ICreateProductRequest } from "@/interfaces/product";
import { createProductSchema } from "@/app/api/validator";

export async function GET(request: NextRequest) {
  const storeName  = request.nextUrl.searchParams.get('storeName');
  const isStockAvailable = request.nextUrl.searchParams.get('isStockAvailable');
  const dbQuery: Prisma.ProductFindManyArgs = {
    include: {
      categories: true,
      store: true
    },
    where: {
      store: {
        isDeleted: false
      }
    }
  }

  if(storeName) {
    dbQuery.where!.store = { name: storeName as string }
  }
  
  if(isStockAvailable) {
    dbQuery.where!.stock = {
      gt: 0
    }
  }
  
  try {
    const products = await prisma.product.findMany(dbQuery);
    return NextResponse.json({ products }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const requestJson = await request.json();
  const createProductReq = createProductSchema.safeParse(requestJson);
  if (!createProductReq.success) {
    return NextResponse.json({ error: createProductReq.error }, { status: 400 });
  }
  
  const productRequest: ICreateProductRequest = createProductReq.data;
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