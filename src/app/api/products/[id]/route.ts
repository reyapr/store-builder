import { Prisma } from '@prisma/client'
import { NextResponse } from 'next/server'

import { prisma } from '@/app/api/config'
import { updateProductSchema } from '@/app/api/validator'
import { removeImageFromFirebase, uploadToFirebase } from '@/utils/firebase'

export async function GET(_: Request, context: { params: any }) {
  const { id } = context.params as { id: string }

  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      store: true,
      categories: true
    }
  })
  if (!product) {
    return NextResponse.json(
      { error: 'Product does not exist' },
      { status: 400 }
    )
  }

  return NextResponse.json(product, { status: 200 })
}

export async function PATCH(request: Request, context: { params: any }) {
  const res = await request.formData()
  const requestJson = Object.fromEntries(res) as Record<string, any>
  requestJson.categoryIds = JSON.parse(requestJson.categoryIds as string)
  requestJson.price = Number(requestJson.price as string)
  if (requestJson.stock) {
    requestJson.stock = Number(requestJson.stock as string)
  }
  const updateProductReq = updateProductSchema.safeParse(requestJson)
  if (!updateProductReq.success) {
    return NextResponse.json({ error: updateProductReq.error }, { status: 400 })
  }

  const { image, ...productRequest } = updateProductReq.data
  const { id } = context.params as { id: string }

  try {
    const currentProduct = await prisma.product.findUnique({ where: { id } })
    if (!currentProduct) {
      return NextResponse.json(
        { error: 'Product does not exist' },
        { status: 400 }
      )
    }
    let newImageUrl
    if (image?.name) {
      try {
        const data = await uploadToFirebase(image)
        newImageUrl = data.downloadURL
      } catch (error) {
        return NextResponse.json(
          { error: (error as Error).message },
          { status: 500 }
        )
      }

      //  remove existing image
      if (currentProduct.imageUrl) {
        await removeImageFromFirebase(currentProduct.imageUrl)
      }
    }

    const productData: Prisma.ProductCreateInput = {
      name: productRequest.name,
      price: productRequest.price,
      description: productRequest.description,
      imageUrl: newImageUrl,
      store: {
        connect: {
          id: productRequest.storeId
        }
      },
      categories: {
        connect: productRequest.categoryIds.map((id: string) => ({ id }))
      },
      ...(productRequest.stock != null && { stock: productRequest.stock }) // Handle null and undefined
    }

    console.log({ productData})
    const store = await prisma.product.update({
      where: {
        id
      },
      data: productData
    })
    return NextResponse.json({ store }, { status: 200 })
  } catch (error) {
    console.log(error, '<=================== error ==================')
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 400 }
    )
  }
}

export async function DELETE(_: Request, context: { params: any }) {
  const { id } = context.params as { id: string }
  try {
    const existingProduct = await prisma.product.findUnique({
      where: {
        id
      }
    })

    if (!existingProduct) {
      return NextResponse.json(
        { error: 'Product does not exist' },
        { status: 400 }
      )
    }

    await prisma.product.delete({
      where: {
        id
      }
    })
    return NextResponse.json(
      { message: 'Success to delete product' },
      { status: 200 }
    )
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 400 }
    )
  }
}
