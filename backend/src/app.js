// Express Configuration
import express from "express";
import cors from "cors";
import helmet from "helmet";
import * as env from "./config/env.js";

import authRoutes from "./routes/auth.routes.js";
import financialProfileRoutes from "./routes/financial-profile.routes.js";
import dashboardRoutes from "./routes/dashboard.routes.js";
import loggerMiddleware from "./middlewares/logger.middleware.js";
import errorMiddleware from "./middlewares/error.middleware.js";
import notFoundMiddleware from "./middlewares/notFound.middleware.js";
import { globalRateLimiter, authPublicRateLimiter, financialProfileRateLimiter, dashboardRateLimiter } from "./middlewares/rate-limit.middleware.js";
import logger from "./utils/logger.js";

const app = express();

// Middlewares de logging (primeiro middleware)
app.use(loggerMiddleware);

// Security middleware - HTTP headers
app.use(helmet());

// CORS configuration with dynamic origin handling
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:3000",
  "http://127.0.0.1:5173",
  "http://127.0.0.1:5174",
  "http://127.0.0.1:3000",
  env.CORS_ORIGIN
];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS not allowed for origin: ${origin}`));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
  maxAge: 86400
}));

app.use(express.json());

// Apply global rate limit to all routes
app.use(globalRateLimiter);

// Apply route-specific rate limiters
app.use("/api/auth", authPublicRateLimiter, authRoutes);
app.use("/api/financial-profile", financialProfileRateLimiter, financialProfileRoutes);
app.use("/api/dashboard", dashboardRateLimiter, dashboardRoutes);

// Middlewares de erro (últimos middlewares)
app.use(notFoundMiddleware);
app.use(errorMiddleware);

export default app;