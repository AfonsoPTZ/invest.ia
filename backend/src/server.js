// Main Server
const app = require("./app");
const logger = require("./utils/logger");
const env = require("./config/env");

// Validate environment variables on startup
try {
  env.validateEnv();
  logger.info("✅ Environment variables validated");
} catch (error) {
  logger.error({ error: error.message }, "❌ Environment validation failed - exiting");
  process.exit(1);
}

app.listen(env.PORT, () => {
  logger.info(`Server running at http://localhost:${env.PORT}`);
});