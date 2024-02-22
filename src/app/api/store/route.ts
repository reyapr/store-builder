import { prisma } from "@/app/api/config";
import { IStoreDTO } from "@/interfaces/store";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const newStoreRequest: IStoreDTO = await request.json();
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
    return NextResponse.json({ error: (error as Error).message }, { status: 400 });
  }
}

export async function GET(request: Request) {
  try {
    const stores = await prisma.store.findMany();
    return NextResponse.json({ stores }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}