import { NextRequest, NextResponse } from 'next/server'

import { prisma } from '@/app/api/config'
import { updateStoreSchema } from '@/app/api/validator'
import { IUpdateStoreRequest } from '@/interfaces/store'

export async function PATCH(request: Request, context: { params: any }) {
  const requestJson = await request.json()
  const updateStoreReq = updateStoreSchema.safeParse(requestJson)

  if (!updateStoreReq.success) {
    return NextResponse.json({ error: updateStoreReq.error }, { status: 400 })
  }

  const updateStoreRequest: IUpdateStoreRequest = updateStoreReq.data
  const { id } = context.params as { id: string }
  try {
    const store = await prisma.store.update({
      where: {
        id
      },
      data: {
        name: updateStoreRequest.name
      }
    })
    return NextResponse.json({ store }, { status: 200 })
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 400 }
    )
  }
}

export async function DELETE(_: NextRequest, context: { params: any }) {
  const { id } = context.params as { id: string }
  try {
    const existingStore = await prisma.store.findUnique({
      where: {
        id
      }
    })

    if (!existingStore) {
      return NextResponse.json(
        { error: 'Store does not exist' },
        { status: 400 }
      )
    }

    await prisma.store.update({
      where: {
        id
      },
      data: {
        isDeleted: true,
        name: `${existingStore.name}-deleted-${new Date().toISOString()}`
      }
    })
    return NextResponse.json(
      { message: 'Success to delete store' },
      { status: 200 }
    )
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 400 }
    )
  }
}

export async function GET(_: NextRequest, context: { params: any }) {
  const { id } = context.params as { id: string }
  try {
    const store = await prisma.store.findUnique({
      where: {
        id,
        isDeleted: false
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    })

    if (!store) {
      return NextResponse.json(
        { error: 'Store not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ store }, { status: 200 })
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    )
  }
}