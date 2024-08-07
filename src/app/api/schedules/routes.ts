import { NextResponse } from 'next/server'

import { prisma } from '@/app/api/config'
import { createStoreSchema } from '@/app/api/validator'
import { ICreateStoreRequest } from '@/interfaces/store'

export async function POST(request: Request) {
  const requestJson = await request.json()
  const createStoreReq = createStoreSchema.safeParse(requestJson)

  if (!createStoreReq.success) {
    return NextResponse.json({ error: createStoreReq.error }, { status: 400 })
  }

  const newStoreRequest: ICreateStoreRequest = createStoreReq.data
  try {
    const existingUser = await prisma.user.findUnique({
      where: {
        email: newStoreRequest.email
      }
    })

    if (!existingUser) {
      return NextResponse.json(
        { error: 'User does not exist' },
        { status: 400 }
      )
    }

    const newStore = await prisma.store.create({
      data: {
        name: newStoreRequest.name,
        user: {
          connect: {
            id: existingUser.id
          }
        }
      }
    })

    return NextResponse.json(
      { store: newStore },
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

export async function GET() {
  try {
    const schedules = await prisma.schedules.findMany()
    return NextResponse.json({ schedules }, { status: 200 })
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    )
  }
}
