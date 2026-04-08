// Token Service - JWT generation and validation
import jwt from "jsonwebtoken";
import type { SignOptions } from "jsonwebtoken";
import logger from "../../utils/logger.js";

// Definir secrets usando variáveis de ambiente (obrigatório)
const JWT_SECRET: string | undefined = process.env.JWT_SECRET;
const JWT_EXPIRATION: string = process.env.JWT_EXPIRATION || "24h";
const TEMP_TOKEN_EXPIRATION: string = "30m"; // Token temporário para perfil financeiro

// Validar que JWT_SECRET é obrigatório
if (!JWT_SECRET) {
  throw new Error("JWT_SECRET must be defined in environment variables (.env file required)");
}

/**
 * Interface para payload do token
 */
interface ITokenPayload {
  id: number;
  email: string;
  type: "auth" | "temp_profile";
}

/**
 * Interface para resultado da validação
 */
interface ITokenValidation {
  valid: boolean;
  decoded?: ITokenPayload;
  error?: string;
}

class TokenService {
  /**
   * Gerar JWT padrão (para login)
   * @param {number} userId - ID do usuário
   * @param {string} email - Email do usuário
   * @returns {string} Token JWT
   */
  generateToken(userId: number, email: string): string {
    try {
      logger.info({ userId, email }, "TokenService: generateToken called");
      
      if (!userId || !email) {
        logger.error({ userId, email }, "TokenService: Missing required parameters");
        throw new Error(`Invalid token parameters: userId=${userId}, email=${email}`);
      }
      
      const payload: ITokenPayload = {
        id: userId,
        email,
        type: "auth"
      };

      // Cast to any for expiresIn since StringValue is not exported
      const options: SignOptions = {
        expiresIn: JWT_EXPIRATION as any
      };

      const token: string = jwt.sign(payload, JWT_SECRET as string, options);

      logger.info({ userId }, "TokenService: JWT generated");
      return token;
    } catch (error) {
      const errorMessage: string = error instanceof Error ? error.message : String(error);
      logger.error({ error: errorMessage, userId }, "TokenService: Error generating JWT");
      throw new Error("Erro ao gerar token");
    }
  }

  /**
   * Gerar token temporário para completar perfil (após OTP)
   * @param {number} userId - ID do usuário
   * @param {string} email - Email do usuário
   * @returns {string} Token JWT temporário
   */
  generateTempToken(userId: number, email: string): string {
    try {
      const payload: ITokenPayload = {
        id: userId,
        email,
        type: "temp_profile"
      };

      // Cast to any for expiresIn since StringValue is not exported
      const options: SignOptions = {
        expiresIn: TEMP_TOKEN_EXPIRATION as any
      };

      const token: string = jwt.sign(payload, JWT_SECRET as string, options);

      logger.info({ userId }, "TokenService: Temporary token generated for profile completion");
      return token;
    } catch (error) {
      const errorMessage: string = error instanceof Error ? error.message : String(error);
      logger.error({ error: errorMessage }, "TokenService: Error generating temporary token");
      throw new Error("Erro ao gerar token temporário");
    }
  }

  /**
   * Validar token JWT
   * @param {string} token - Token a validar
   * @returns {ITokenValidation}
   */
  validateToken(token: string): ITokenValidation {
    try {
      const decoded: any = jwt.verify(token, JWT_SECRET as string);
      logger.info({ userId: decoded.id }, "TokenService: Token validated successfully");

      return {
        valid: true,
        decoded: decoded as ITokenPayload
      };
    } catch (error) {
      const errorMessage: string = error instanceof Error ? error.message : String(error);
      logger.warn({ error: errorMessage }, "TokenService: Token validation failed");

      return {
        valid: false,
        error: errorMessage
      };
    }
  }

  /**
   * Decodificar token sem validar (apenas para ler payload)
   * @param {string} token - Token a decodificar
   * @returns {ITokenPayload | null}
   */
  decodeToken(token: string): ITokenPayload | null {
    try {
      const decoded: any = jwt.decode(token);
      logger.debug("TokenService: Token decoded");
      return decoded as ITokenPayload | null;
    } catch (error) {
      const errorMessage: string = error instanceof Error ? error.message : String(error);
      logger.error({ error: errorMessage }, "TokenService: Error decoding token");
      return null;
    }
  }
}

export default new TokenService();
export type { ITokenPayload, ITokenValidation };
