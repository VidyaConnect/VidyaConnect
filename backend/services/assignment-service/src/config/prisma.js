import { PrismaClient } from "../generated/prisma/index.js";

const globalForPrisma = globalThis;
const prisma = globalForPrisma.assignmentPrisma || new PrismaClient();
if (process.env.NODE_ENV !== "production") globalForPrisma.assignmentPrisma = prisma;
export default prisma;
