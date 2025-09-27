// app/lib/prisma.ts
// import { PrismaClient } from "../generated/prisma/index.js";
// import { PrismaClient } from "@prisma/client";
import pkg from "@prisma/client";
const { PrismaClient } = pkg;

// @ts-ignore
const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") {
    globalForPrisma.prisma = prisma;
}
