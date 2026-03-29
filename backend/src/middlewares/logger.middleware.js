// Logger Middleware - HTTP request/response logging with Pino
const pinoHttp = require("pino-http");
const logger = require("../utils/logger");

/**
 * Middleware de logging HTTP usando pino-http
 * Registra automaticamente: method, url, status, responseTime
 */
const loggerMiddleware = pinoHttp(
  {
    logger: logger,
    customProps: (request, response) => ({
      clientIp: request.ip,
      userAgent: request.get("user-agent")
    }),
    customLogLevel: (request, response, error) => {
      if (response.statusCode >= 400 && response.statusCode < 500) {
        return "warn";
      } else if (response.statusCode >= 500 || error) {
        return "error";
      }
      return "info";
    }
  }
);

module.exports = loggerMiddleware;
