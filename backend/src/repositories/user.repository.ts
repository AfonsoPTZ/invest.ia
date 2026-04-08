import prisma from "../config/db.js";
import logger from "../utils/logger.js";
import type { User } from "@prisma/client";

/**
 * Interface para o retorno customizado de create()
 * Não inclui passwordHash (campo sensível)
 */
interface IUserCreateResponse {
  id: number;
  name: string;
  email: string;
  cpf: string;
  phone: string;
}

/**
 * Interface para dados de entrada do create()
 */
interface IUserCreateData {
  name: string;
  email: string;
  cpf: string;
  phone: string;
  passwordHash: string;
}

/**
 * Interface para dados de OTP
 */
interface IOtpData {
  otpCodeHash?: string | null;
  otpExpiresAt?: Date | null;
  otpAttempts?: number;
}

class UserRepository {
  async findByEmail(email: string): Promise<User | null> {
    try {
      logger.debug({ email }, "Searching user by email");
      return await prisma.user.findUnique({ where: { email } });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      logger.error({ error: errorMessage, email }, "Error searching user by email");
      throw new Error(`Erro ao buscar usuário por email: ${errorMessage}`);
    }
  }

  async findById(id: number): Promise<User | null> {
    try {
      logger.debug({ id }, "Searching user by ID");
      return await prisma.user.findUnique({ where: { id } });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      logger.error({ error: errorMessage, id }, "Error searching user by ID");
      throw new Error(`Erro ao buscar usuário por ID: ${errorMessage}`);
    }
  }

  async create(userData: IUserCreateData): Promise<IUserCreateResponse> {
    try {
      const { name, email, cpf, phone, passwordHash } = userData;
      logger.info({ email, cpf }, "Creating new user");
      
      const user = await prisma.user.create({
        data: { name, email, cpf, phone, passwordHash }
      });
      
      logger.info({ userId: user.id, email }, "User created successfully");
      
      return {
        id: user.id,
        name: user.name,
        email: user.email,
        cpf: user.cpf,
        phone: user.phone
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      logger.error({ error: errorMessage, email: userData.email }, "Error creating user");
      throw new Error(`Erro ao criar usuário: ${errorMessage}`);
    }
  }

  async emailExists(email: string): Promise<boolean> {
    try {
      logger.debug({ email }, "Checking if email exists");
      const user = await prisma.user.findUnique({ where: { email } });
      return user !== null;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      logger.error({ error: errorMessage, email }, "Error checking email existence");
      throw new Error(`Erro ao verificar email: ${errorMessage}`);
    }
  }

  async cpfExists(cpf: string): Promise<boolean> {
    try {
      logger.debug({ cpf }, "Checking if CPF exists");
      const user = await prisma.user.findUnique({ where: { cpf } });
      return user !== null;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      logger.error({ error: errorMessage, cpf }, "Error checking CPF existence");
      throw new Error(`Erro ao verificar CPF: ${errorMessage}`);
    }
  }

  async phoneExists(phone: string): Promise<boolean> {
    try {
      logger.debug({ phone }, "Checking if phone exists");
      const user = await prisma.user.findUnique({ where: { phone } });
      return user !== null;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      logger.error({ error: errorMessage, phone }, "Error checking phone existence");
      throw new Error(`Error checking phone existence: ${errorMessage}`);
    }
  }

  async updatePassword(userId: number, passwordHash: string): Promise<boolean> {
    try {
      logger.info({ userId }, "Updating user password");
      
      const result = await prisma.user.update({
        where: { id: userId },
        data: { passwordHash }
      });
      
      logger.info({ userId }, "User password updated");
      return result !== null;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      logger.error({ error: errorMessage, userId }, "Error updating user password");
      throw new Error(`Erro ao atualizar senha: ${errorMessage}`);
    }
  }

  async updateOtp(userId: number, otpData: IOtpData): Promise<boolean> {
    try {
      const { otpCodeHash, otpExpiresAt, otpAttempts } = otpData;
      logger.debug({ userId }, "Updating OTP");

      const result = await prisma.user.update({
        where: { id: userId },
        data: {
          otpCodeHash,
          otpExpiresAt,
          otpAttempts: otpAttempts || 0
        }
      });

      logger.debug({ userId }, "OTP updated");
      return result !== null;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      logger.error({ error: errorMessage, userId }, "Error updating OTP");
      throw new Error(`Erro ao atualizar OTP: ${errorMessage}`);
    }
  }

  async incrementOtpAttempts(userId: number): Promise<boolean> {
    try {
      logger.debug({ userId }, "Incrementing OTP attempts");

      const result = await prisma.user.update({
        where: { id: userId },
        data: { otpAttempts: { increment: 1 } }
      });

      logger.debug({ userId }, "OTP attempts incremented");
      return result !== null;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      logger.error({ error: errorMessage, userId }, "Error incrementing OTP attempts");
      throw new Error(`Erro ao incrementar tentativas: ${errorMessage}`);
    }
  }

  async updateEmailVerification(userId: number, verified: boolean): Promise<boolean> {
    try {
      logger.info({ userId, verified }, "Updating email verification status");

      const result = await prisma.user.update({
        where: { id: userId },
        data: { emailVerified: verified }
      });

      logger.info({ userId, verified }, "Email verification status updated");
      return result !== null;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      logger.error({ error: errorMessage, userId }, "Error updating email verification");
      throw new Error(`Erro ao atualizar verificação: ${errorMessage}`);
    }
  }
}

export default new UserRepository();
export type { IUserCreateResponse, IUserCreateData, IOtpData };
