import { prisma } from "@/app/api/config";
import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { createProductSchema } from "@/app/api/validator";
import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import { StorageError } from "@supabase/storage-js";

interface ISupabaseDataUploadResponse {
  id: string; 
  path: string; 
  fullPath: string 
}
interface ISupabaseUploadResponse { 
  data: ISupabaseDataUploadResponse | null,
  error: StorageError
}

export async function GET(request: NextRequest) {
  const storeName  = request.nextUrl.searchParams.get('storeName');
  const isStockAvailable = request.nextUrl.searchParams.get('isStockAvailable');
  const categories = request.nextUrl.searchParams.get('categories');
  const searchQuery = request.nextUrl.searchParams.get('q');
  
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
  
  if(searchQuery) {
    dbQuery.where!.name = {
      contains: searchQuery,
      mode: 'insensitive'
    }
  }
  
  if(categories) {
    dbQuery.where!.categories = {
      some: {
        id: {
          in: categories.split(',')
        }
      }
    }
  }
  
  try {
    const products = await prisma.product.findMany(dbQuery);
    return NextResponse.json({ products }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

const updloadToSupabase = async (image: File): Promise<ISupabaseUploadResponse> => {
  if(process.env.BUCKET_NAME === undefined) {
    throw new Error('BUCKET_NAME is not defined');
  }
  const cookieStore = cookies();
  const supabase = createClient(cookieStore)
 
  const response = await supabase
    .storage
    .from(process.env.BUCKET_NAME)
    .upload(image.name, image, {
      upsert: false,
    })

  return response as ISupabaseUploadResponse;
}

export async function POST(request: NextRequest) {
  const res = await request.formData()
  const requestJson = Object.fromEntries(res) as Record<string, any>;
  requestJson.categoryIds = JSON.parse(requestJson.categoryIds as string);
  requestJson.price = Number(requestJson.price as string);
  requestJson.stock = Number(requestJson.stock as string);
  
  const createProductReq = createProductSchema.safeParse(requestJson);
  if (!createProductReq.success) {
    return NextResponse.json({ error: createProductReq.error }, { status: 400 });
  }
  const { image, ...productRequest } = createProductReq.data;
  const { data, error } = await updloadToSupabase(image)
  if(error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  
  if(!data) {
    return NextResponse.json({ error: 'Image upload failed' }, { status: 500 });
  }
  console.log(data.fullPath, '<=================== data.fullPath ==================');
  
  try {
    
    const product = await prisma.product.create({
      data: { 
        name: productRequest.name,
        price: productRequest.price,
        stock: productRequest.stock,
        description: productRequest.description,
        imageUrl: process.env.NEXT_PUBLIC_SUPABASE_IMAGE_URL + '/' + data.fullPath,
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