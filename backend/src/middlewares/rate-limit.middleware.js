// Rate Limiting Middleware - DoS and brute force protection
import rateLimit, { ipKeyGenerator } from "express-rate-limit";
import logger from "../utils/logger.js";

/**
 * Global Rate Limiter
 * Applied to all routes - basic protection against DoS
 * 100 requests per 15 minutes per IP
 */
const globalRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  standardHeaders: true, // return rate limit info in `RateLimit-*` headers
  legacyHeaders: false, // disable `X-RateLimit-*` headers
  message: "Too many requests from this IP, please try again later.",
  keyGenerator: ipKeyGenerator,
  skip: (request, response) => {
    // Don't apply rate limit to health checks
    if (request.path === "/health") {
      return true;
    }
    return false;
  },
  handler: (request, response, next, options) => {
    logger.warn(
      { ip: request.ip, path: request.path, method: request.method },
      `Rate limit exceeded: Global limiter (${options.max} requests per ${options.windowMs / 60000} minutes)`
    );
    return response.status(429).json({
      status: "error",
      message: options.message,
      retryAfter: request.rateLimit.resetTime
    });
  }
});

/**
 * Auth Routes - Public Routes Rate Limiter (STRICT)
 * Applied to /api/auth routes:
 * - POST /api/auth/register
 * - POST /api/auth/login
 * - POST /api/auth/register-with-otp
 * - POST /api/auth/verify-email
 * - POST /api/auth/resend-otp
 * 
 * 5 requests per 15 minutes per IP (VERY STRICT - prevents brute force)
 */
const authPublicRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // STRICT: only 5 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: "Too many authentication attempts, please try again later.",
  keyGenerator: ipKeyGenerator,
  skip: (request, response) => {
    // Only apply to public auth routes (not protected)
    // Protected routes like /logout and /me should not have this limit
    const publicPaths = ["/register", "/login", "/register-with-otp", "/verify-email", "/resend-otp"];
    const isPublicPath = publicPaths.some(path => request.path.includes(path));
    return !isPublicPath;
  },
  handler: (request, response, next, options) => {
    logger.warn(
      { ip: request.ip, path: request.path, email: request.body?.email },
      `Rate limit exceeded: Auth public limiter (${options.max} requests per ${options.windowMs / 60000} minutes)`
    );
    return response.status(429).json({
      status: "error",
      message: options.message,
      retryAfter: request.rateLimit.resetTime
    });
  }
});

/**
 * Financial Profile Rate Limiter
 * Applied to /api/financial-profile routes:
 * - POST /api/financial-profile/
 * - GET /api/financial-profile/:usuarioId
 * 
 * 15 requests per 15 minutes per IP (moderate protection)
 */
const financialProfileRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 15, // 15 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: "Too many requests to financial profile endpoint, please try again later.",
  keyGenerator: ipKeyGenerator,
  handler: (request, response, next, options) => {
    logger.warn(
      { ip: request.ip, path: request.path, userId: request.user?.id },
      `Rate limit exceeded: Financial profile limiter (${options.max} requests per ${options.windowMs / 60000} minutes)`
    );
    return response.status(429).json({
      status: "error",
      message: options.message,
      retryAfter: request.rateLimit.resetTime
    });
  }
});

/**
 * Dashboard Rate Limiter
 * Applied to /api/dashboard routes:
 * - GET /api/dashboard/
 * - GET /api/dashboard/name
 * - GET /api/dashboard/investments
 * 
 * 20 requests per 15 minutes per IP (light protection)
 */
const dashboardRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // 20 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: "Too many dashboard requests, please try again later.",
  keyGenerator: ipKeyGenerator,
  handler: (request, response, next, options) => {
    logger.warn(
      { ip: request.ip, path: request.path, userId: request.user?.id },
      `Rate limit exceeded: Dashboard limiter (${options.max} requests per ${options.windowMs / 60000} minutes)`
    );
    return response.status(429).json({
      status: "error",
      message: options.message,
      retryAfter: request.rateLimit.resetTime
    });
  }
});

export {
  globalRateLimiter,
  authPublicRateLimiter,
  financialProfileRateLimiter,
  dashboardRateLimiter
};
