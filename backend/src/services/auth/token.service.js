// Token Service - JWT generation and validation
const jwt = require("jsonwebtoken");
const logger = require("../../utils/logger");

// Definir secrets usando variáveis de ambiente (obrigatório)
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRATION = process.env.JWT_EXPIRATION || "24h";
const TEMP_TOKEN_EXPIRATION = "30m"; // Token temporário para perfil financeiro

// Validar que JWT_SECRET é obrigatório
if (!JWT_SECRET) {
  throw new Error("JWT_SECRET must be defined in environment variables (.env file required)");
}

/**
 * Gerar JWT padrão (para login)
 * @param {number} userId - ID do usuário
 * @param {string} email - Email do usuário
 * @returns {string} Token JWT
 */
function generateToken(userId, email) {
  try {
    logger.info({ userId, email, userIdType: typeof userId, emailType: typeof email }, "TokenService: generateToken called");
    
    if (!userId || !email) {
      logger.error({ userId, email }, "TokenService: Missing required parameters");
      throw new Error(`Invalid token parameters: userId=${userId}, email=${email}`);
    }
    
    const token = jwt.sign(
      {
        id: userId,
        email,
        type: "auth"
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRATION }
    );

    logger.info({ userId }, "TokenService: JWT generated");
    return token;
  } catch (error) {
    logger.error({ error: error.message, userId }, "TokenService: Error generating JWT");
    throw new Error("Erro ao gerar token");
  }
}

/**
 * Gerar token temporário para completar perfil (após OTP)
 * @param {number} userId - ID do usuário
 * @param {string} email - Email do usuário
 * @returns {string} Token JWT temporário
 */
function generateTempToken(userId, email) {
  try {
    const token = jwt.sign(
      {
        id: userId,
        email,
        type: "temp_profile"
      },
      JWT_SECRET,
      { expiresIn: TEMP_TOKEN_EXPIRATION }
    );

    logger.info({ userId }, "TokenService: Temporary token generated for profile completion");
    return token;
  } catch (error) {
    logger.error({ error: error.message }, "TokenService: Error generating temporary token");
    throw new Error("Erro ao gerar token temporário");
  }
}

/**
 * Validar token JWT
 * @param {string} token - Token a validar
 * @returns {{valid: boolean, decoded: object, error: string}}
 */
function validateToken(token) {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    logger.info({ userId: decoded.userId }, "TokenService: Token validated successfully");
    return {
      valid: true,
      decoded,
      error: null
    };
  } catch (error) {
    logger.warn({ error: error.message }, "TokenService: Token validation failed");
    return {
      valid: false,
      decoded: null,
      error: error.message
    };
  }
}

/**
 * Decodificar token sem validar assinatura (apenas para debug)
 * @param {string} token - Token a decodificar
 * @returns {object} Token decodificado
 */
function decodeToken(token) {
  try {
    return jwt.decode(token);
  } catch (error) {
    logger.error({ error: error.message }, "TokenService: Error decoding token");
    return null;
  }
}

module.exports = {
  generateToken,
  generateTempToken,
  validateToken,
  decodeToken
};
