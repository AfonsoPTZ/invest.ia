// JWT Authentication Middleware
const tokenService = require("../services/auth/token.service");
const logger = require("../utils/logger");

function authMiddleware(request, response, next) {
  const authorizationHeader = request.headers.authorization;

  if (!authorizationHeader) {
    logger.warn({}, "AuthMiddleware: Token not provided");
    return response.status(401).json({
      status: "error",
      message: "Token not provided"
    });
  }

  const headerParts = authorizationHeader.split(" ");
  const token = headerParts[1];

  if (!token) {
    logger.warn({}, "AuthMiddleware: Invalid or malformed token");
    return response.status(401).json({
      status: "error",
      message: "Invalid or malformed token"
    });
  }

  try {
    const validation = tokenService.validateToken(token);

    if (!validation.valid) {
      logger.warn({ error: validation.error }, "AuthMiddleware: Token validation failed");
      return response.status(401).json({
        status: "error",
        message: "Token expired or invalid"
      });
    }

    const decodedData = validation.decoded;
    // Aceita ambos os tipos de token: auth e temp_profile
    const tokenType = decodedData.type || "auth";
    
    request.user = {
      id: decodedData.id,
      email: decodedData.email,
      name: decodedData.name,
      tokenType
    };

    logger.info({ userId: decodedData.id, tokenType }, "AuthMiddleware: Token validated successfully");
    next();

  } catch (error) {
    logger.error({ error: error.message }, "AuthMiddleware: Error validating token");
    return response.status(401).json({
      status: "error",
      message: "Token expired or invalid"
    });
  }
}

module.exports = authMiddleware;