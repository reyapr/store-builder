import { prisma } from '@/app/api/config'
import { createCategorySchema } from '@/app/api/validator'
import { Prisma } from '@prisma/client'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const storeName = request.nextUrl.searchParams.get('storeName')

  const dbQuery: Prisma.CategoryFindManyArgs = {
    include: {
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

  try {
    const categories = await prisma.category.findMany(dbQuery)

    return NextResponse.json({ categories }, { status: 200 })
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  const requestJson = await request.json()
  const createCategoryReq = createCategorySchema.safeParse(requestJson)

  if (!createCategoryReq.success) {
    return NextResponse.json(
      { error: createCategoryReq.error },
      { status: 400 }
    )
  }
  const { storeId, ...newCategory } = createCategoryReq.data
  try {
    const category = await prisma.category.create({
      data: {
        ...newCategory,
        store: {
          connect: {
            id: storeId
          }
        }
      }
    })
    return NextResponse.json(
      { category },
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
