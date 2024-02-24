import { prisma } from "@/app/api/config";
import { ICreateStoreRequest } from "@/interfaces/store";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const newStoreRequest: ICreateStoreRequest = await request.json();
  try {
    const existingUser = await prisma.user.findUnique({
      where: {
        email: newStoreRequest.email
      }
    })
    
    if (!existingUser) {
      return NextResponse.json({ error: 'User does not exist' }, { status: 400 });
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
    });
    
    return NextResponse.json({ store: newStore }, {
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

export async function GET(request: Request) {
  try {
    const stores = await prisma.store.findMany({
      where: {
        isDeleted: false
      }
    });
    return NextResponse.json({ stores }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}