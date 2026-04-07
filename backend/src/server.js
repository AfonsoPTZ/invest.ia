// Main Server
import "dotenv/config.js";
import app from "./app.js";
import logger from "./utils/logger.js";
import { validateEnv, PORT } from "./config/env.js";

// Validate environment variables on startup
try {
  validateEnv();
  logger.info("✅ Environment variables validated");
} catch (error) {
  logger.error({ error: error.message }, "❌ Environment validation failed - exiting");
  process.exit(1);
}

app.listen(PORT, () => {
  logger.info(`Server running at http://localhost:${PORT}`);
});