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

// CORS configuration (validated in config/env.js)
app.use(cors({
  origin: env.CORS_ORIGIN,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
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