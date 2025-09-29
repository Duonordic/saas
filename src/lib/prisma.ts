// lib/prisma.ts
import { PrismaClient } from "@prisma/client";

// 1. Extend the global object with the PrismaClient type
const globalForPrisma = global as unknown as { prisma: PrismaClient };

// 2. Use the existing global instance if available, otherwise create a new one
export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ["query", "error", "warn"], // Optional: Log database queries in dev
  });

// 3. In development, save the client instance to the global object
//    to ensure HMR uses the existing client.
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export default prisma;
