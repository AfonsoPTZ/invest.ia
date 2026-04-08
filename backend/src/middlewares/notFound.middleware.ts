// Not Found Middleware - 404 handler with logging
import { Request, Response } from "express";
import logger from "../utils/logger.js";

/**
 * Middleware para rotas não encontradas
 * Retorna 404 e registra a tentativa
 */
function notFoundMiddleware(request: Request, response: Response): Response {
  const message: string = `Route not found: ${request.method} ${request.originalUrl}`;

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

export default notFoundMiddleware;
