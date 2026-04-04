// Environment Variables Configuration
// Validates and centralizes all ENV variables
// Call validateEnv() on server startup to fail-fast if critical vars are missing

require("dotenv").config();

const requiredEnvVars = [
  "PORT",
  "NODE_ENV",
  "CORS_ORIGIN",
  "DATABASE_URL",
  "JWT_SECRET",
  "EMAIL_HOST",
  "EMAIL_PORT",
  "EMAIL_USER",
  "EMAIL_PASSWORD",
  "FRONTEND_URL"
];

/**
 * Validate that all required ENV variables are defined
 * Throws error if any required variable is missing
 */
function validateEnv() {
  const missing = requiredEnvVars.filter(varName => !process.env[varName]);

  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(", ")}`);
  }
}

module.exports = {
  validateEnv,
  
  // Server
  PORT: process.env.PORT || 3000,
  NODE_ENV: process.env.NODE_ENV || "development",
  
  // CORS
  CORS_ORIGIN: process.env.CORS_ORIGIN || "http://localhost:5173",
  
  // Database
  DATABASE_URL: process.env.DATABASE_URL,
  
  // JWT
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRATION: process.env.JWT_EXPIRATION || "24h",
  
  // Email
  EMAIL_HOST: process.env.EMAIL_HOST,
  EMAIL_PORT: parseInt(process.env.EMAIL_PORT, 10),
  EMAIL_SECURE: process.env.EMAIL_SECURE === "true",
  EMAIL_USER: process.env.EMAIL_USER,
  EMAIL_PASSWORD: process.env.EMAIL_PASSWORD,
  
  // Frontend
  FRONTEND_URL: process.env.FRONTEND_URL,
  
  // OTP Configuration (with defaults)
  OTP_EXPIRATION_MINUTES: parseInt(process.env.OTP_EXPIRATION_MINUTES || "5", 10),
  OTP_MAX_ATTEMPTS: parseInt(process.env.OTP_MAX_ATTEMPTS || "3", 10),
  OTP_LOCKOUT_MINUTES: parseInt(process.env.OTP_LOCKOUT_MINUTES || "15", 10),
  
  // Logging
  LOG_LEVEL: process.env.LOG_LEVEL || "info"
};
