import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

import { prisma } from '@/app/api/config'
import { updateProductSchema } from '@/app/api/validator'
import { ISupabaseUploadResponse } from '@/interfaces/supabase'
import { createClient } from '@/utils/supabase/server'

const replaceImageInSupabase = async (
  image: File,
  currentUrl: string | null
): Promise<ISupabaseUploadResponse> => {
  if (process.env.BUCKET_NAME === undefined) {
    throw new Error('BUCKET_NAME is not defined')
  }
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)

  if (currentUrl) {
    const splittedUrl = currentUrl.split('/')
    const currentPath = splittedUrl[splittedUrl.length - 1]
    const removeResponse = await supabase.storage
      .from(process.env.BUCKET_NAME)
      .remove([`${currentPath}`])
    if (removeResponse.error) {
      throw new Error(removeResponse.error.message)
    }
  }

  const uploadResponse = await supabase.storage
    .from(process.env.BUCKET_NAME)
    .upload(image.name, image)

  return uploadResponse as ISupabaseUploadResponse
}

export async function GET(_: Request, context: { params: any }) {
  const { id } = context.params as { id: string }

  const product = await prisma.product.findUnique({ where: { id } })
  if (!product) {
    return NextResponse.json(
      { error: 'Product does not exist' },
      { status: 400 }
    )
  }

  return NextResponse.json(product, { status: 200})
}

export async function PATCH(request: Request, context: { params: any }) {
  const res = await request.formData()
  const requestJson = Object.fromEntries(res) as Record<string, any>
  requestJson.categoryIds = JSON.parse(requestJson.categoryIds as string)
  requestJson.price = Number(requestJson.price as string)
  requestJson.stock = Number(requestJson.stock as string)

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
      const { data, error } = await replaceImageInSupabase(
        image,
        currentProduct.imageUrl
      )
      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
      }
      if (!data) {
        return NextResponse.json(
          { error: 'Image upload failed' },
          { status: 500 }
        )
      }
      const cookieStore = cookies()
      const supabase = createClient(cookieStore)

      const { data: storageData } = supabase.storage
        .from(process.env.BUCKET_NAME as string)
        .getPublicUrl(data.path)
      newImageUrl = storageData.publicUrl
    }

    const store = await prisma.product.update({
      where: {
        id
      },
      data: {
        name: productRequest.name,
        price: productRequest.price,
        stock: productRequest.stock,
        description: productRequest.description,
        imageUrl: newImageUrl || currentProduct.imageUrl,
        store: {
          connect: {
            id: productRequest.storeId
          }
        },
        categories: {
          set: productRequest.categoryIds.map((id: string) => ({ id }))
        }
      }
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
