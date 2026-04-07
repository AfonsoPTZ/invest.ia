// Environment Variables Configuration
// Validates and centralizes all ENV variables
// Call validateEnv() on server startup to fail-fast if critical vars are missing

// NOTE: dotenv.config() is called in server.js BEFORE importing this module
// This ensures ENV vars are loaded before any configuration is accessed

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
export function validateEnv() {
  const missing = requiredEnvVars.filter(varName => !process.env[varName]);

  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(", ")}`);
  }
}

// Server
export const PORT = process.env.PORT || 3000;
export const NODE_ENV = process.env.NODE_ENV || "development";

// CORS
export const CORS_ORIGIN = process.env.CORS_ORIGIN || "http://localhost:5173";

// Database
export const DATABASE_URL = process.env.DATABASE_URL;

// JWT
export const JWT_SECRET = process.env.JWT_SECRET;
export const JWT_EXPIRATION = process.env.JWT_EXPIRATION || "24h";

// Email
export const EMAIL_HOST = process.env.EMAIL_HOST;
export const EMAIL_PORT = parseInt(process.env.EMAIL_PORT, 10);
export const EMAIL_SECURE = process.env.EMAIL_SECURE === "true";
export const EMAIL_USER = process.env.EMAIL_USER;
export const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD;

// Frontend
export const FRONTEND_URL = process.env.FRONTEND_URL;

// OTP Configuration (with defaults)
export const OTP_EXPIRATION_MINUTES = parseInt(process.env.OTP_EXPIRATION_MINUTES || "5", 10);
export const OTP_MAX_ATTEMPTS = parseInt(process.env.OTP_MAX_ATTEMPTS || "3", 10);
export const OTP_LOCKOUT_MINUTES = parseInt(process.env.OTP_LOCKOUT_MINUTES || "15", 10);

// Logging
export const LOG_LEVEL = process.env.LOG_LEVEL || "info";
