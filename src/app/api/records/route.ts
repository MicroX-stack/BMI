import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import jwt from "jsonwebtoken"
import prisma from "@/lib/prisma"
import { z } from "zod"
import { calculateBMI } from "@/lib/bmi"

const recordSchema = z.object({
  weight: z.number().positive(),
  height: z.number().positive(),
  note: z.string().optional(),
})

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"

async function getUserFromToken() {
  const cookieStore = await cookies()
  const token = cookieStore.get("token")?.value

  if (!token) return null

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: number }
    return decoded.userId
  } catch {
    return null
  }
}

export async function GET() {
  const userId = await getUserFromToken()
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const records = await prisma.bMIRecord.findMany({
    where: { user_id: userId },
    orderBy: { recorded_at: "desc" },
  })

  return NextResponse.json(records)
}

export async function POST(request: Request) {
  const userId = await getUserFromToken()
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { weight, height, note } = recordSchema.parse(body)

    const bmi = calculateBMI(weight, height)

    const record = await prisma.bMIRecord.create({
      data: {
        user_id: userId,
        weight,
        height,
        bmi,
        note,
      },
    })

    return NextResponse.json(record, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: (error as any).errors }, { status: 400 })
    }
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    )
  }
}
