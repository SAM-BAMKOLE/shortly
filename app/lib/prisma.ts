// app/lib/prisma.ts
// import { PrismaClient } from "../generated/prisma/index.js";
// import { PrismaClient } from "@prisma/client";
import { createClient } from "@libsql/client";
import { PrismaLibSQL } from "@prisma/adapter-libsql";
import pkg from "@prisma/client";
const { PrismaClient } = pkg;

//@ts-ignore
let prisma: PrismaClient;

if (process.env.TURSO_DATABASE_URL) {
  // Production on Vercel

  const libsql = createClient({
    url: process.env.TURSO_DATABASE_URL!,
    authToken: process.env.TURSO_AUTH_TOKEN,
  });

  // @ts-ignore
  const adapter = new PrismaLibSQL(libsql);
  prisma = new PrismaClient({ adapter });
} else {
  // Local dev fallback
  //   prisma = new PrismaClient();
  // @ts-ignore
  const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };
  prisma = globalForPrisma.prisma || new PrismaClient();
  if (process.env.NODE_ENV !== "production") {
      globalForPrisma.prisma = prisma;
  }
}

export { prisma };
