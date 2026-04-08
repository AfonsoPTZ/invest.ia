// Environment Variables Configuration
// Validates and centralizes all ENV variables
// Call validateEnv() on server startup to fail-fast if critical vars are missing

// NOTE: dotenv.config() is called in server.ts BEFORE importing this module
// This ensures ENV vars are loaded before any configuration is accessed

const requiredEnvVars: string[] = [
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
export function validateEnv(): void {
  const missing = requiredEnvVars.filter(varName => !process.env[varName]);

  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(", ")}`);
  }
}

// Server
export const PORT: number = parseInt(process.env.PORT || "3000", 10);
export const NODE_ENV: string = process.env.NODE_ENV || "development";

// CORS
export const CORS_ORIGIN: string = process.env.CORS_ORIGIN || "http://localhost:5173";

// Database
export const DATABASE_URL: string = process.env.DATABASE_URL || "";

// JWT
export const JWT_SECRET: string = process.env.JWT_SECRET || "";
export const JWT_EXPIRATION: string = process.env.JWT_EXPIRATION || "24h";

// Email
export const EMAIL_HOST: string = process.env.EMAIL_HOST || "";
export const EMAIL_PORT: number = parseInt(process.env.EMAIL_PORT || "587", 10);
export const EMAIL_SECURE: boolean = process.env.EMAIL_SECURE === "true";
export const EMAIL_USER: string = process.env.EMAIL_USER || "";
export const EMAIL_PASSWORD: string = process.env.EMAIL_PASSWORD || "";

// Frontend
export const FRONTEND_URL: string = process.env.FRONTEND_URL || "";
