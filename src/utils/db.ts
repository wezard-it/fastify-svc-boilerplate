import { PrismaClient } from '@prisma/client'
import config from '../config/server.config'

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined
}

let prisma: PrismaClient

if (config.env === 'production') {
    prisma = new PrismaClient()
} else {
    if (globalForPrisma.prisma === undefined || globalForPrisma.prisma === null) {
        globalForPrisma.prisma = new PrismaClient()
    }

    prisma = globalForPrisma.prisma
}

export default prisma
