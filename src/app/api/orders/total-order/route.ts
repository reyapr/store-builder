import { NextRequest, NextResponse } from 'next/server'

import { prisma } from '@/app/api/config'
import { ETimeFrame } from '@/constants/order'

export async function GET(request: NextRequest) {
  const timeFrame: ETimeFrame = request.nextUrl.searchParams.get(
    'timeFrame'
  ) as ETimeFrame
  const year = request.nextUrl.searchParams.get('year')
  try {
    let result
    switch (timeFrame) {
      case ETimeFrame.DAILY:
        result = await prisma.$queryRaw`
          SELECT 
            sum("total") as total_amount, 
            to_char("createdAt" , 'yyyy-MM-dd') as time, 
            'daily' as "time_frame"
          FROM "Order"
          WHERE to_char("createdAt", 'YYYY') = ${year}
          GROUP BY TO_CHAR("createdAt" , 'yyyy-MM-dd')
          ORDER BY time;
        `
        break
      case ETimeFrame.WEEKLY:
        result = await prisma.$queryRaw`
          SELECT sum("total") as total_amount, extract(week from "createdAt") as time, 'weekly' as "time_frame" 
          FROM "Order"
          WHERE to_char("createdAt", 'YYYY') = ${year}
          GROUP BY EXTRACT(WEEK FROM "createdAt")
          ORDER BY time;
        `
        break
      case ETimeFrame.MONTHLY:
        result = await prisma.$queryRaw`
          SELECT sum("total") as total_amount, extract(MONTH FROM "createdAt") as time, 'monthly' as "time_frame" 
          FROM "Order"
          WHERE to_char("createdAt", 'YYYY') = ${year}
          GROUP BY EXTRACT(MONTH FROM "createdAt")
          ORDER BY time;
        `
        break
      default:
        NextResponse.json({ error: 'Invalid timeFrame' }, { status: 400 })
        break
    }

    return NextResponse.json({ result }, { status: 200 })
  } catch (error) {
    console.log(error, '<=================== error ==================')
    return NextResponse.json({ error: 'An error occurred' }, { status: 500 })
  }
}
