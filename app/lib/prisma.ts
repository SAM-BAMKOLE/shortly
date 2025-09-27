// app/lib/prisma.ts
// import { PrismaClient } from "../generated/prisma/index.js";
// import { PrismaClient } from "@prisma/client";
import pkg from "@prisma/client";
const { PrismaClient } = pkg;

import { PrismaClient } from "@prisma/client";

let prisma: PrismaClient;

if (process.env.TURSO_DATABASE_URL) {
  // Production on Vercel
  const { createClient } = await import("@libsql/client");
  const { PrismaLibSQL } = await import("@prisma/adapter-libsql");

  const libsql = createClient({
    url: process.env.TURSO_DATABASE_URL!,
    authToken: process.env.TURSO_AUTH_TOKEN,
  });

  const adapter = new PrismaLibSQL(libsql);
  prisma = new PrismaClient({ adapter });
} else {
  // Local dev fallback
  //   prisma = new PrismaClient();
  const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };
  prisma = globalForPrisma.prisma || new PrismaClient();
  if (process.env.NODE_ENV !== "production") {
      globalForPrisma.prisma = prisma;
  }
}

export default prisma;
