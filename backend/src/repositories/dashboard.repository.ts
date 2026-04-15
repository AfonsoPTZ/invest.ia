import prisma from "../config/db.js";
import logger from "../utils/logger.js";
import { Decimal } from "@prisma/client/runtime/library";
import type { FinancialProfile } from "@prisma/client";

/**
 * Interface para retorno customizado do getUserById()
 */
interface IDashboardUser {
  id: number;
  name: string;
  email: string;
  cpf: string;
  phone: string;
}

/**
 * Interface para retorno customizado do getFinancialProfileByUserId()
 * Usa snake_case como em _toApiFormat
 */
interface IDashboardFinancialProfile {
  id: number;
  user_id: number;
  monthly_income: Decimal;
  initial_balance: Decimal;
  has_investments: boolean;
  has_assets: boolean;
  financial_goal: string;
  behavior_profile: string;
  created_at: Date;
  updated_at: Date;
}

/**
 * Interface para retorno do getDashboardData()
 */
interface IDashboardData {
  user: IDashboardUser | null;
  financialProfile: IDashboardFinancialProfile | null;
}

class DashboardRepository {
  async getUserById(userId: number): Promise<IDashboardUser | null> {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          name: true,
          email: true,
          cpf: true,
          phone: true
        }
      });

      return user;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      logger.error({ error: errorMessage, userId }, "Error searching user");
      throw new Error(`Error searching user: ${errorMessage}`);
    }
  }

  async getFinancialProfileByUserId(userId: number): Promise<IDashboardFinancialProfile | null> {
    try {
      const profile = await prisma.financialProfile.findUnique({ where: { userId } });

      return profile ? this._toApiFormat(profile) : null;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      logger.error({ error: errorMessage, userId }, "Error searching financial profile");
      throw new Error(`Error searching financial profile: ${errorMessage}`);
    }
  }

  async getDashboardData(userId: number): Promise<IDashboardData | null> {
    try {
      logger.debug({ userId }, "Repository: Fetching dashboard data");

      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          name: true,
          email: true,
          cpf: true,
          phone: true
        }
      });

      if (!user) {
        return null;
      }

      const profile = await prisma.financialProfile.findUnique({ where: { userId } });

      return {
        user,
        financialProfile: profile ? this._toApiFormat(profile) : null
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      logger.error({ error: errorMessage, userId }, "Error fetching dashboard data");
      throw new Error(`Error fetching dashboard data: ${errorMessage}`);
    }
  }

  /**
   * Helper to convert Prisma FinancialProfile data to API format (snake_case)
   */
  private _toApiFormat(profile: FinancialProfile): IDashboardFinancialProfile {
    return {
      id: profile.id,
      user_id: profile.userId,
      monthly_income: profile.monthlyIncome,
      initial_balance: profile.initialBalance,
      has_investments: profile.hasInvestments,
      has_assets: profile.hasAssets,
      financial_goal: profile.financialGoal,
      behavior_profile: profile.behaviorProfile,
      created_at: profile.createdAt,
      updated_at: profile.updatedAt
    };
  }
}

export default new DashboardRepository();
export type { IDashboardUser, IDashboardFinancialProfile, IDashboardData };
