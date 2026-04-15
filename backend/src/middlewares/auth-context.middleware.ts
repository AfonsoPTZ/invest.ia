// Auth Context Middleware - Validate authenticated user context
// Ensures request.user.id is present and valid
// Throws AppError(401) if not authenticated
import { Request, Response, NextFunction } from "express";
import logger from "../utils/logger.js";
import AppError from "../utils/AppError.js";

/**
 * Middleware para validar contexto de autenticação
 * Garante que request.user.id existe
 * Lança AppError(401) se não autenticado
 * 
 * Uso: router.get('/endpoint', authContextMiddleware, controller.method)
 */
function authContextMiddleware(request: Request, response: Response, next: NextFunction): void {
  try {
    const user = (request as any).user;
    const userId = user?.id;

    // Validar se user existe
    if (!user) {
      logger.warn({ url: request.originalUrl }, "AuthContext: User not found in request");
      throw new AppError("Unauthorized: User context required", 401);
    }

    // Validar se userId é válido (número positivo)
    if (!userId || typeof userId !== "number" || userId <= 0) {
      logger.warn({ userId, url: request.originalUrl }, "AuthContext: Invalid user ID");
      throw new AppError("Unauthorized: Invalid user ID", 401);
    }

    // Log de sucesso
    logger.debug({ userId }, "AuthContext: User context validated");

    // Continuar para próximo middleware/controller
    next();

  } catch (error) {
    // Se for AppError, propagar. Senão, wrappear em AppError(500)
    if (error instanceof AppError) {
      next(error);
    } else {
      const errorMessage = error instanceof Error ? error.message : String(error);
      logger.error({ error: errorMessage }, "AuthContext: Unexpected error in auth context validation");
      next(new AppError("Internal server error", 500));
    }
  }
}

export default authContextMiddleware;
