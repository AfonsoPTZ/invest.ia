const prisma = require("../config/db");
const logger = require("../utils/logger");

class FinancialProfileRepository {
  async create(userId, profileData) {
    try {
      logger.info({ userId }, "Creating financial profile");
      
      const profile = await prisma.financialProfile.create({
        data: {
          userId,
          monthlyIncome: profileData.monthlyIncome || profileData.monthly_income,
          initialBalance: profileData.initialBalance || profileData.initial_balance,
          hasInvestments: profileData.hasInvestments || profileData.has_investments,
          hasAssets: profileData.hasAssets || profileData.has_assets,
          financialGoal: profileData.financialGoal || profileData.financial_goal,
          behaviorProfile: profileData.behaviorProfile || profileData.behavior_profile
        }
      });

      logger.info({ userId, profileId: profile.id }, "Financial profile created successfully");
      return this._toApiFormat(profile);
    } catch (error) {
      logger.error({ error: error.message, userId }, "Error creating financial profile");
      throw new Error(`Error creating financial profile: ${error.message}`);
    }
  }

  async findByUserId(userId) {
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
      logger.error({ error: error.message, userId }, "Error searching financial profile");
      throw new Error(`Error searching financial profile: ${error.message}`);
    }
  }

  async createOrUpdate(userId, profileData) {
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
      logger.error({ error: error.message, userId }, "Error in createOrUpdate");
      throw new Error(`Error in createOrUpdate: ${error.message}`);
    }
  }

  async update(userId, profileData) {
    try {
      logger.info({ userId }, "Updating financial profile");
      
      const updateData = {};
      const fieldsMap = {
        monthlyIncome: ["monthlyIncome", "monthly_income"],
        initialBalance: ["initialBalance", "initial_balance"],
        hasInvestments: ["hasInvestments", "has_investments"],
        hasAssets: ["hasAssets", "has_assets"],
        financialGoal: ["financialGoal", "financial_goal"],
        behaviorProfile: ["behaviorProfile", "behavior_profile"]
      };

      Object.entries(fieldsMap).forEach(([prismaField, [camelKey, snakeKey]]) => {
        if (profileData[camelKey] !== undefined) {
          updateData[prismaField] = profileData[camelKey];
        } else if (profileData[snakeKey] !== undefined) {
          updateData[prismaField] = profileData[snakeKey];
        }
      });

      const result = await prisma.financialProfile.update({
        where: { userId },
        data: updateData
      });

      logger.info({ userId }, "Financial profile updated");
      return result !== null;
    } catch (error) {
      logger.error({ error: error.message, userId }, "Error updating financial profile");
      throw new Error(`Error updating financial profile: ${error.message}`);
    }
  }

  // Helper to convert Prisma data to API format
  _toApiFormat(profile) {
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

  // Helper to build response object
  _buildResponse(userId, profileData, profileId) {
    return {
      id: profileId,
      user_id: userId,
      monthly_income: profileData.monthly_income || profileData.monthlyIncome,
      initial_balance: profileData.initial_balance || profileData.initialBalance,
      has_investments: profileData.has_investments || profileData.hasInvestments,
      has_assets: profileData.has_assets || profileData.hasAssets,
      financial_goal: profileData.financial_goal || profileData.financialGoal,
      behavior_profile: profileData.behavior_profile || profileData.behaviorProfile
    };
  }
}

module.exports = new FinancialProfileRepository();
