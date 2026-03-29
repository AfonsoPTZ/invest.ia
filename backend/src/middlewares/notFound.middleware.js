// Not Found Middleware - 404 handler with logging
const logger = require("../utils/logger");

/**
 * Middleware para rotas não encontradas
 * Retorna 404 e registra a tentativa
 */
function notFoundMiddleware(request, response) {
  const message = `Route not found: ${request.method} ${request.originalUrl}`;

  // Log da rota não encontrada
  logger.warn(
    {
      method: request.method,
      url: request.originalUrl,
      clientIp: request.ip
    },
    message
  );

  return response.status(404).json({
    status: "error",
    statusCode: 404,
    message: "Route not found"
  });
}

module.exports = notFoundMiddleware;
