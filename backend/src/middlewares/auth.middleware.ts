// JWT Authentication Middleware
import { Request, Response, NextFunction } from "express";
import tokenService from "../services/auth/token.service.js";
import logger from "../utils/logger.js";

interface AuthUser {
  id: string;
  email: string;
  name: string;
  tokenType: string;
}

function authMiddleware(request: Request, response: Response, next: NextFunction): Response | void {
  const authorizationHeader: string | undefined = request.headers.authorization;

  if (!authorizationHeader) {
    logger.warn({}, "AuthMiddleware: Token not provided");
    return response.status(401).json({
      status: "error",
      message: "Token not provided"
    });
  }

  const headerParts: string[] = authorizationHeader.split(" ");
  const token: string | undefined = headerParts[1];

  if (!token) {
    logger.warn({}, "AuthMiddleware: Invalid or malformed token");
    return response.status(401).json({
      status: "error",
      message: "Invalid or malformed token"
    });
  }

  try {
    const validation: any = tokenService.validateToken(token);

    if (!validation.valid) {
      logger.warn({ error: validation.error }, "AuthMiddleware: Token validation failed");
      return response.status(401).json({
        status: "error",
        message: "Token expired or invalid"
      });
    }

    const decodedData: any = validation.decoded;
    // Aceita ambos os tipos de token: auth e temp_profile
    const tokenType: string = decodedData.type || "auth";
    
    (request as any).user = {
      id: decodedData.id,
      email: decodedData.email,
      name: decodedData.name,
      tokenType
    } as AuthUser;

    logger.info({ userId: decodedData.id, tokenType }, "AuthMiddleware: Token validated successfully");
    next();

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logger.error({ error: errorMessage }, "AuthMiddleware: Error validating token");
    return response.status(401).json({
      status: "error",
      message: "Token expired or invalid"
    });
  }
}

export default authMiddleware;
