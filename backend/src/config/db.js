// MySQL Connection Pool
const mysql = require("mysql2/promise");
require("dotenv").config();

const connectionPool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Test database connection on startup
async function testDatabaseConnection() {
  try {
    const connection = await connectionPool.getConnection();
    console.log("✅ Database connected successfully");
    connection.release();
  } catch (error) {
    console.error("❌ Error connecting to database:", error.message);
  }
}

testDatabaseConnection();

module.exports = connectionPool;