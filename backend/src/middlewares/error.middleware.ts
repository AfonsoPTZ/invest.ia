// Error Middleware - Centralized error handling with logging
// Supports: AppError (with statusCode) and native Error (defaults to 500)
import { Request, Response, NextFunction } from "express";
import logger from "../utils/logger.js";
import * as env from "../config/env.js";

/**
 * Middleware de erro centralizado
 * Captura erros de AppError ou Error genérico
 * Registra o erro com contexto completo
 * Retorna resposta padronizada
 */
function errorMiddleware(error: any, request: Request, response: Response, next: NextFunction): Response {
  // AppError: has statusCode | Generic Error: defaults to 500
  const statusCode: number = error.statusCode || 500;
  const message: string = error.message || "Internal Server Error";

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
    ...(env.NODE_ENV === "development" && { stack: error.stack })
  });
}

export default errorMiddleware;
