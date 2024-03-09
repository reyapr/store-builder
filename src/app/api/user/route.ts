import { prisma } from "@/app/api/config"
import { User } from "@prisma/client"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  const user: User = await request.json()
  
  
  const existingUser = await prisma.user.findUnique({
    where: {
      email: user.email
    }
  })
  
  if(existingUser) {
    return NextResponse.json({
      error: 'User already exists'
    }, { status: 400})
  }
  
  const newUser = await prisma.user.create({
    data: {...user}
  })
  
  return NextResponse.json({
    user: newUser
  }, { status: 200})
}