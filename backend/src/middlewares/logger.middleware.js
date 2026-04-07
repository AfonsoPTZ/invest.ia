// Logger Middleware - HTTP request/response logging with Pino
import pinoHttp from "pino-http";
import logger from "../utils/logger.js";

/**
 * Middleware de logging HTTP usando pino-http
 * Registra automaticamente: method, url, status, responseTime
 */
const loggerMiddleware = pinoHttp(
  {
    logger: logger,
    customProps: (request) => ({
      clientIp: request.ip,
      userAgent: request.get("user-agent")
    }),
    customLogLevel: (_, response, error) => {
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
