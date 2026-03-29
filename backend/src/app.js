// Express Configuration
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/auth.routes");
const financialProfileRoutes = require("./routes/financial-profile.routes");
const dashboardRoutes = require("./routes/dashboard.routes");
const loggerMiddleware = require("./middlewares/logger.middleware");
const errorMiddleware = require("./middlewares/error.middleware");
const notFoundMiddleware = require("./middlewares/notFound.middleware");

const app = express();

// Middlewares de logging (primeiro middleware)
app.use(loggerMiddleware);

if (!process.env.CORS_ORIGIN) {
  console.warn("WARNING: CORS_ORIGIN not defined in .env. Using http://localhost:5173 as fallback for development.");
}

app.use(cors({
  origin: process.env.CORS_ORIGIN || "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/financial-profile", financialProfileRoutes);
app.use("/api/dashboard", dashboardRoutes);

// Middlewares de erro (últimos middlewares)
app.use(notFoundMiddleware);
app.use(errorMiddleware);

module.exports = app;