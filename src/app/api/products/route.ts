import { Prisma } from '@prisma/client'
import { NextRequest, NextResponse } from 'next/server'

import { prisma } from '@/app/api/config'
import { createProductSchema } from '@/app/api/validator'
import { uploadToFirebase } from '@/utils/firebase'

export async function GET(request: NextRequest) {
  const storeName = request.nextUrl.searchParams.get('storeName')
  const isStockAvailable = request.nextUrl.searchParams.get('isStockAvailable')
  const categories = request.nextUrl.searchParams.get('categories')
  const searchQuery = request.nextUrl.searchParams.get('q')

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

  if (storeName) {
    dbQuery.where!.store = { name: storeName as string }
  }

  if (isStockAvailable) {
    dbQuery.where!.stock = {
      gt: 0
    }
  }

  if (searchQuery) {
    dbQuery.where!.name = {
      contains: searchQuery,
      mode: 'insensitive'
    }
  }

  if (categories) {
    dbQuery.where!.categories = {
      some: {
        id: {
          in: categories.split(',')
        }
      }
    }
  }

  try {
    const products = await prisma.product.findMany(dbQuery)
    return NextResponse.json({ products }, { status: 200 })
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    )
  }
}


export async function POST(request: NextRequest) {
  const res = await request.formData()
  const requestJson = Object.fromEntries(res) as Record<string, any>
  requestJson.categoryIds = JSON.parse(requestJson.categoryIds as string)
  requestJson.price = Number(requestJson.price as string)

  if(requestJson.stock){
    requestJson.stock = Number(requestJson.stock as string)
  }

  const createProductReq = createProductSchema.safeParse(requestJson)
  if (!createProductReq.success) {
    return NextResponse.json({ error: createProductReq.error }, { status: 400 })
  }
  const { image, ...productRequest } = createProductReq.data

  let imageUrl
  if (image.name) {
     try {
      const data = await uploadToFirebase(image)
      imageUrl = data.downloadURL
    } catch (error) {
      return NextResponse.json({ error: (error as Error).message }, { status: 500 })
    }
    
  }

  const productData: Prisma.ProductCreateInput = {
    name: productRequest.name,
    price: productRequest.price,
    description: productRequest.description,
    imageUrl: imageUrl,
    store: {
      connect: {
        id: productRequest.storeId
      }
    },
    categories: {
      connect: productRequest.categoryIds.map((id: string) => ({ id }))
    },
    ...(productRequest.stock != null && { stock: productRequest.stock }) // Handle null and undefined
  };

  try {
    const product = await prisma.product.create({
      data: productData
    })
    return NextResponse.json(
      { product },
      {
        status: 201
      }
    )
  } catch (error) {
    let status = 500
    if ((error as Error).message.includes('Unique constraint')) {
      status = 400
    }
    return NextResponse.json({ error: (error as Error).message }, { status })
  }
}
