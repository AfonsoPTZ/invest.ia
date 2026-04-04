// Express Configuration
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const env = require("./config/env");

const authRoutes = require("./routes/auth.routes");
const financialProfileRoutes = require("./routes/financial-profile.routes");
const dashboardRoutes = require("./routes/dashboard.routes");
const loggerMiddleware = require("./middlewares/logger.middleware");
const errorMiddleware = require("./middlewares/error.middleware");
const notFoundMiddleware = require("./middlewares/notFound.middleware");
const { globalRateLimiter, authPublicRateLimiter, financialProfileRateLimiter, dashboardRateLimiter } = require("./middlewares/rate-limit.middleware");
const logger = require("./utils/logger");

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

module.exports = app;