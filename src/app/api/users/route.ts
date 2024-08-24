import { User } from '@prisma/client'
import { NextResponse } from 'next/server'

import { prisma } from '@/app/api/config'

export async function POST(request: Request) {
  const user: User = await request.json()

  const existingUser = await prisma.user.findUnique({
    where: {
      email: user.email
    }
  })

  if (existingUser) {
    return NextResponse.json(
      {
        error: 'User already exists'
      },
      { status: 400 }
    )
  }

  const newUser = await prisma.user.create({
    data: { ...user }
  })

  return NextResponse.json(
    {
      user: newUser
    },
    { status: 200 }
  )
}

export async function GET(request: Request) {
  try {
    // Parse query parameters
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search') || ''

    // Calculate skip value for pagination
    const skip = (page - 1) * limit

    // Fetch users with pagination and search
    const users = await prisma.user.findMany({
      where: {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { email: { contains: search, mode: 'insensitive' } }
        ]
      },
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' }
    })

    // Get total count for pagination
    const totalUsers = await prisma.user.count({
      where: {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { email: { contains: search, mode: 'insensitive' } }
        ]
      }
    })

    return NextResponse.json(
      {
        users,
        totalUsers,
        currentPage: page,
        totalPages: Math.ceil(totalUsers / limit)
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error fetching users:', error)
    return NextResponse.json(
      { error: 'An error occurred while fetching users' },
      { status: 500 }
    )
  }
}
