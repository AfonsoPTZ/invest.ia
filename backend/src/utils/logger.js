// Logger Configuration - Pino setup
import pino from "pino";

/**
 * Configuração centralizada do logger Pino
 * Ambiente: development usa pino-pretty, production usa JSON
 */
const logger = pino(
  {
    level: process.env.LOG_LEVEL || "info",
    transport:
      process.env.NODE_ENV === "production"
        ? undefined
        : {
            target: "pino-pretty",
            options: {
              colorize: true,
              translateTime: "SYS:standard",
              ignore: "pid,hostname"
            }
          }
  }
);

export default logger;
