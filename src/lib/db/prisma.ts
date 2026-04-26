// eslint-disable-next-line @typescript-eslint/no-require-imports
const { PrismaClient } = require('@prisma/client')
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { PrismaLibSql } = require('@prisma/adapter-libsql')
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { createClient } = require('@libsql/client')

const globalForPrisma = globalThis as { prisma?: typeof PrismaClient }

function createPrismaClient() {
  const url = process.env.DATABASE_URL || 'file:./prisma/dev.db'
  const libsql = createClient({ url })
  const adapter = new PrismaLibSql(libsql)
  return new PrismaClient({ adapter })
}

export const prisma: ReturnType<typeof createPrismaClient> =
  globalForPrisma.prisma || createPrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
