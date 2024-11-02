import { NextRequest, NextResponse } from 'next/server'

import { prisma } from '@/app/api/config'

export async function GET(request: NextRequest) {
  try {
    // Get dateStart and dateEnd from query parameters
    const searchParams = request.nextUrl.searchParams
    const dateStart = searchParams.get('dateStart')
    const dateEnd = searchParams.get('dateEnd')

    // Validate dateStart
    if (!dateStart) {
      return NextResponse.json({ error: 'dateStart is required' }, { status: 400 })
    }

    // Prepare the where clause
    const whereClause: any = {
      createdAt: {
        gte: new Date(dateStart),
      },
    }

    // Add dateEnd to the where clause if it's provided
    if (dateEnd) {
      whereClause.createdAt.lte = new Date(dateEnd)
    }

    const orders = await prisma.order.findMany({
      where: whereClause,
      include: {
        productOrders: {
          include: {
            product: true,
          },
        },
        store: true,
        customer: true,
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    return NextResponse.json(orders, { status: 200 })
  } catch (error) {
    console.log(error, '<=================== error ==================')
    return NextResponse.json({ error: 'An error occurred' }, { status: 500 })
  }
}
