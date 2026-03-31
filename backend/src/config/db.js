// Prisma Client Configuration - Simple Local MySQL Setup
const { PrismaClient } = require("@prisma/client");
require("dotenv").config();

// Simplest possible initialization
const prisma = new PrismaClient();

// Test database connection on startup
async function testDatabaseConnection() {
  try {
    await prisma.$connect();
    console.log("✅ Database connected successfully");
  } catch (error) {
    console.error("❌ Error connecting to database:", error.message);
  }
}

testDatabaseConnection();

// Handle application shutdown
process.on("SIGINT", async () => {
  await prisma.$disconnect();
  process.exit(0);
});

module.exports = prisma;