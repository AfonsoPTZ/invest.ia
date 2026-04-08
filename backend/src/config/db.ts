// Prisma Client Configuration - Simple Local MySQL Setup
import { PrismaClient } from "@prisma/client";
import logger from "../utils/logger.js";

// Simplest possible initialization
const prisma: PrismaClient = new PrismaClient();

// Test database connection on startup
async function testDatabaseConnection(): Promise<void> {
  try {
    await prisma.$connect();
    logger.info("✅ Database connected successfully");
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logger.error({ error: errorMessage }, "❌ Error connecting to database");
  }
}

testDatabaseConnection();

// Handle application shutdown
process.on("SIGINT", async () => {
  await prisma.$disconnect();
  process.exit(0);
});

export default prisma;
