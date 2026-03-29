// Error Middleware - Centralized error handling with logging
const logger = require("../utils/logger");

/**
 * Middleware de erro centralizado
 * Registra o erro e retorna resposta padronizada
 */
function errorMiddleware(error, request, response, next) {
  const statusCode = error.statusCode || 500;
  const message = error.message || "Internal Server Error";

  // Log do erro com contexto completo
  logger.error(
    {
      statusCode,
      errorMessage: message,
      method: request.method,
      url: request.originalUrl,
      stack: error.stack
    },
    `Request error: ${message}`
  );

  return response.status(statusCode).json({
    status: "error",
    statusCode,
    message,
    ...(process.env.NODE_ENV === "development" && { stack: error.stack })
  });
}

module.exports = errorMiddleware;
