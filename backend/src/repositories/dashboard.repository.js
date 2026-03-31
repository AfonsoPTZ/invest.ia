const prisma = require("../config/db");
const logger = require("../utils/logger");

class DashboardRepository {
  async getUserById(userId) {
    try {
      logger.debug({ userId }, "Searching user by ID");

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
        logger.debug({ userId }, "User not found");
        return null;
      }

      logger.debug({ userId }, "User found");
      return user;
    } catch (error) {
      logger.error({ error: error.message, userId }, "Error searching user");
      throw new Error(`Error searching user: ${error.message}`);
    }
  }

  async getFinancialProfileByUserId(userId) {
    try {
      logger.debug({ userId }, "Searching financial profile");

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

  async getDashboardData(userId) {
    try {
      logger.debug({ userId }, "Fetching dashboard data");

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
        logger.debug({ userId }, "User not found");
        return null;
      }

      const profile = await prisma.financialProfile.findUnique({ where: { userId } });

      logger.debug({ userId }, "Dashboard data fetched");

      return {
        user,
        financialProfile: profile ? this._toApiFormat(profile) : null
      };
    } catch (error) {
      logger.error({ error: error.message, userId }, "Error fetching dashboard data");
      throw new Error(`Error fetching dashboard data: ${error.message}`);
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
}

module.exports = new DashboardRepository();
