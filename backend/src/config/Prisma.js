import { PrismaClient } from "../generated/prisma/index.js";

const globalForPrisma = globalThis;

const Prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = Prisma;
}

export { Prisma };
