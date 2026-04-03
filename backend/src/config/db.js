// Prisma Client Configuration - Simple Local MySQL Setup
const { PrismaClient } = require("@prisma/client");
require("dotenv").config();
const logger = require("../utils/logger");

// Simplest possible initialization
const prisma = new PrismaClient();

// Test database connection on startup
async function testDatabaseConnection() {
  try {
    await prisma.$connect();
    logger.info("✅ Database connected successfully");
  } catch (error) {
    logger.error({ error: error.message }, "❌ Error connecting to database");
  }
}

testDatabaseConnection();

// Handle application shutdown
process.on("SIGINT", async () => {
  await prisma.$disconnect();
  process.exit(0);
});

module.exports = prisma;