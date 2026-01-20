import { PrismaClient } from "@/generated/client/client"
import { withAccelerate } from "@prisma/extension-accelerate"

const prismaClientSingleton = () => {
  console.log("Initializing Prisma Client with Accelerate extension...")
  try {
    const client = new PrismaClient({
      accelerateUrl: process.env.DATABASE_URL!,
    })
      .$extends(withAccelerate())

    console.log("Prisma Client initialized successfully.")
    return client
  } catch (error) {
    console.error("Failed to initialize Prisma Client:", error)
    throw error
  }
}

declare const globalThis: {
  prismaGlobal: ReturnType<typeof prismaClientSingleton>
} & typeof global

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton()

export default prisma

if (process.env.NODE_ENV !== "production") globalThis.prismaGlobal = prisma
