import { PrismaClient } from "@/generated/client/client"
import { withAccelerate } from "@prisma/extension-accelerate"

const prismaClientSingleton = () => {
  console.log("Initializing Prisma Client with Accelerate extension...")
  
  const url = process.env.DATABASE_URL
  if (!url) {
    console.error("Error: DATABASE_URL is not defined in environment variables.")
    // In build time, we might want to skip this or throw. 
    // Throwing is better to catch config errors.
    throw new Error("DATABASE_URL is missing")
  }

  try {
    const client = new PrismaClient({
      accelerateUrl: url,
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
