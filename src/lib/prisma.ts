import { PrismaClient } from "@/generated/client/client"
import { createClient } from "@libsql/client"
import { PrismaLibSql } from "@prisma/adapter-libsql"

const prismaClientSingleton = () => {
  console.log("Initializing Prisma Client with LibSQL adapter...")
  try {
    const adapter = new PrismaLibSql({
      url: process.env.DATABASE_URL!,
    })
    
    const client = new PrismaClient({ adapter })
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
