import prisma from "../config/db.js";
import logger from "../utils/logger.js";
import { Decimal } from "@prisma/client/runtime/library";
import type { FinancialProfile } from "@prisma/client";

/**
 * Interface para dados de entrada (aceita camelCase ou snake_case)
 */
interface IProfileData {
  monthlyIncome?: number | string | Decimal;
  monthly_income?: number | string | Decimal;
  initialBalance?: number | string | Decimal;
  initial_balance?: number | string | Decimal;
  hasInvestments?: boolean | string;
  has_investments?: boolean | string;
  hasAssets?: boolean | string;
  has_assets?: boolean | string;
  financialGoal?: string;
  financial_goal?: string;
  behaviorProfile?: string;
  behavior_profile?: string;
}

/**
 * Interface para retorno customizado (usa snake_case como em _toApiFormat)
 */
interface IProfileResponse {
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
 * Interface simples para _buildResponse retorno
 */
interface IProfileBuildResponse {
  id: number;
  user_id: number;
  monthly_income: number | string | Decimal;
  initial_balance: number | string | Decimal;
  has_investments: boolean | string;
  has_assets: boolean | string;
  financial_goal: string;
  behavior_profile: string;
}

class FinancialProfileRepository {
  async create(userId: number, profileData: IProfileData): Promise<IProfileResponse> {
    try {
      logger.info({ userId }, "Creating financial profile");
      
      const profile = await prisma.financialProfile.create({
        data: {
          userId,
          monthlyIncome: (profileData.monthlyIncome ?? profileData.monthly_income) as number,
          initialBalance: (profileData.initialBalance ?? profileData.initial_balance) as number,
          hasInvestments: (profileData.hasInvestments ?? profileData.has_investments) as boolean,
          hasAssets: (profileData.hasAssets ?? profileData.has_assets) as boolean,
          financialGoal: (profileData.financialGoal ?? profileData.financial_goal) as string,
          behaviorProfile: (profileData.behaviorProfile ?? profileData.behavior_profile) as string
        }
      });

      logger.info({ userId, profileId: profile.id }, "Financial profile created successfully");
      return this._toApiFormat(profile);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      logger.error({ error: errorMessage, userId }, "Error creating financial profile");
      throw new Error(`Error creating financial profile: ${errorMessage}`);
    }
  }

  async findByUserId(userId: number): Promise<IProfileResponse | null> {
    try {
      logger.debug({ userId }, "Searching financial profile by user ID");
      
      const profile = await prisma.financialProfile.findUnique({ where: { userId } });
      
      if (!profile) {
        logger.debug({ userId }, "Financial profile not found");
        return null;
      }
      
      logger.debug({ userId }, "Financial profile found");
      return this._toApiFormat(profile);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      logger.error({ error: errorMessage, userId }, "Error searching financial profile");
      throw new Error(`Error searching financial profile: ${errorMessage}`);
    }
  }

  async createOrUpdate(userId: number, profileData: IProfileData): Promise<IProfileResponse | IProfileBuildResponse> {
    try {
      const existing = await this.findByUserId(userId);
      
      if (existing) {
        logger.info({ userId }, "Profile exists, updating");
        await this.update(userId, profileData);
        return this._buildResponse(userId, profileData, existing.id);
      }
      
      logger.info({ userId }, "Profile does not exist, creating");
      return await this.create(userId, profileData);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      logger.error({ error: errorMessage, userId }, "Error in createOrUpdate");
      throw new Error(`Error in createOrUpdate: ${errorMessage}`);
    }
  }

  async update(userId: number, profileData: IProfileData): Promise<boolean> {
    try {
      logger.info({ userId }, "Updating financial profile");
      
      const updateData: Record<string, any> = {};
      const fieldsMap: Record<string, [string, string]> = {
        monthlyIncome: ["monthlyIncome", "monthly_income"],
        initialBalance: ["initialBalance", "initial_balance"],
        hasInvestments: ["hasInvestments", "has_investments"],
        hasAssets: ["hasAssets", "has_assets"],
        financialGoal: ["financialGoal", "financial_goal"],
        behaviorProfile: ["behaviorProfile", "behavior_profile"]
      };

      Object.entries(fieldsMap).forEach(([prismaField, [camelKey, snakeKey]]) => {
        if (profileData[camelKey as keyof IProfileData] !== undefined) {
          updateData[prismaField] = profileData[camelKey as keyof IProfileData];
        } else if (profileData[snakeKey as keyof IProfileData] !== undefined) {
          updateData[prismaField] = profileData[snakeKey as keyof IProfileData];
        }
      });

      const result = await prisma.financialProfile.update({
        where: { userId },
        data: updateData
      });

      logger.info({ userId }, "Financial profile updated");
      return result !== null;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      logger.error({ error: errorMessage, userId }, "Error updating financial profile");
      throw new Error(`Error updating financial profile: ${errorMessage}`);
    }
  }

  /**
   * Helper to convert Prisma data to API format (snake_case)
   */
  private _toApiFormat(profile: FinancialProfile): IProfileResponse {
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

  /**
   * Helper to build response object
   */
  private _buildResponse(userId: number, profileData: IProfileData, profileId: number): IProfileBuildResponse {
    return {
      id: profileId,
      user_id: userId,
      monthly_income: profileData.monthly_income ?? profileData.monthlyIncome ?? 0,
      initial_balance: profileData.initial_balance ?? profileData.initialBalance ?? 0,
      has_investments: profileData.has_investments ?? profileData.hasInvestments ?? false,
      has_assets: profileData.has_assets ?? profileData.hasAssets ?? false,
      financial_goal: profileData.financial_goal ?? profileData.financialGoal ?? "",
      behavior_profile: profileData.behavior_profile ?? profileData.behaviorProfile ?? ""
    };
  }
}

export default new FinancialProfileRepository();
export type { IProfileData, IProfileResponse, IProfileBuildResponse };
