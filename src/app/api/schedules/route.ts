import { NextRequest, NextResponse } from 'next/server'

import { prisma } from '@/app/api/config'
import { createProductScheduleSchema } from '@/app/api/validator'
import { IProductScheduleRequest } from '@/interfaces/store'

interface PrismaError extends Error {
  code?: string;
}

function isPrismaError(error: any): error is PrismaError {
  return error instanceof Error && 'code' in error;
}


export async function POST(request: Request) {
  const requestJson = await request.json()
  const createProductScheduleReq = createProductScheduleSchema.safeParse(requestJson)

  
  if (!createProductScheduleReq.success) {
    return NextResponse.json({ error: createProductScheduleReq.error }, { status: 400 })
  }

  const newProductScheduleRequest: IProductScheduleRequest = createProductScheduleReq.data

  try {
    const { productId, date } = newProductScheduleRequest;

    if (!productId || !date) {
      return NextResponse.json(
        { message: 'Invalid input' },
        { status: 400 }
      )
    }

      // Check if the product exists
      const productExists = await prisma.product.findUnique({
        where: { id: productId },
      });
  
      if (!productExists) {
        return NextResponse.json(
          { message: 'Product not found' },
          { status: 404 }
        )
      }

    // Create the schedule
    const schedule = await prisma.schedule.create({
      data: {
        date: new Date(date),
        products: {
          create: {
            productId: productId,
          },
        },
      },
      include: {
        products: {
          include: {
            product: true, // This includes the full product details
          },
        },
      },
    });

    return NextResponse.json(
      { schedule },
      { status: 200 }
    )

  } catch (error) {
    console.log({ error })
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 }
    )
  }
}


export async function DELETE(req: NextRequest) {
  try {
    const { scheduleId, productId } = await req.json();

    if (!scheduleId || !productId) {
      return NextResponse.json({ error: 'Schedule ID and Product ID are required' }, { status: 400 });
    }

    // Delete the product from the schedule
    const deletedProductSchedule = await prisma.productSchedule.delete({
      where: {
        productId_scheduleId: {
          productId: productId,
          scheduleId: scheduleId,
        },
      },
    });

    return NextResponse.json({ message: 'Product removed from schedule successfully', deletedProductSchedule });
  } catch (error) {
    console.error('Error deleting product from schedule:', error);

    if (isPrismaError(error) && error.code === 'P2025') {
      return NextResponse.json({ error: 'Schedule not found' }, { status: 404 });
    }


    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  const startOfTheWeek = request.nextUrl.searchParams.get('start')
  const endOfTheWeek = request.nextUrl.searchParams.get('end')

  const whereQuery = (!!startOfTheWeek && !!endOfTheWeek) ? {
    date: {
      gte: startOfTheWeek,
      lte: endOfTheWeek,
    },
  } : {}

  try {
    const schedules = await prisma.schedule.findMany({
      where: whereQuery,
      include: {
        products: {
          include: {
            product: true,
          },
        },
      },
    });
    return NextResponse.json({ schedules }, { status: 200 })
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    )
  }
}
