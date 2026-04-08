// Logger Middleware - HTTP request/response logging with Pino
import { Request, Response } from "express";
import pinoHttp from "pino-http";
import logger from "../utils/logger.js";

/**
 * Middleware de logging HTTP usando pino-http
 * Registra automaticamente: method, url, status, responseTime
 */
const loggerMiddleware: any = (pinoHttp as any)(
  {
    logger: logger,
    customProps: (request: Request) => ({
      clientIp: request.ip,
      userAgent: request.get("user-agent")
    }),
    customLogLevel: (_: Request, response: Response, error?: Error): string => {
      if (response.statusCode >= 400 && response.statusCode < 500) {
        return "warn";
      } else if (response.statusCode >= 500 || error) {
        return "error";
      }
      return "info";
    }
  }
);

export default loggerMiddleware;
