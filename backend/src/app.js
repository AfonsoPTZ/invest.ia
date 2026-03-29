// Express Configuration
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const financialProfileRoutes = require("./routes/perfilFinanceiroRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const loggerMiddleware = require("./middlewares/logger.middleware");
const errorMiddleware = require("./middlewares/error.middleware");
const notFoundMiddleware = require("./middlewares/notFound.middleware");

const app = express();

// Middlewares de logging (primeiro middleware)
app.use(loggerMiddleware);

app.use(cors({
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/perfil-financeiro", financialProfileRoutes);
app.use("/api/dashboard", dashboardRoutes);

// Middlewares de erro (últimos middlewares)
app.use(notFoundMiddleware);
app.use(errorMiddleware);

module.exports = app;