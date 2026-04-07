// Dashboard Service - Doorkeeper pattern
// Orchestrates: Repository calls for dashboard data
import dashboardRepository from "../repositories/dashboard.repository.js";
import logger from "../utils/logger.js";

class DashboardService {
  /**
   * Fetches complete dashboard data: user + financial profile
   * @param {number} userId - User ID (já validado pelo middleware)
   */
  async getDashboardData(userId) {
    try {
      logger.info({ userId }, "Service: Starting dashboard data retrieval");

      // Repository faz os GETs
      const dashboardData = await dashboardRepository.getDashboardData(userId);
      
      if (!dashboardData) {
        logger.warn({ userId }, "Service: Dashboard data not found");
        throw new Error("Dashboard data not found");
      }

      logger.info({ userId }, "Service: Dashboard data retrieved successfully");

      return {
        user: dashboardData.user,
        financialProfile: dashboardData.financialProfile
      };

    } catch (error) {
      logger.error({ error: error.message, userId }, "Service: Error retrieving dashboard data");
      throw new Error(error.message);
    }
  }

  /**
   * Fetches only user name
   * @param {number} userId - User ID (já validado pelo middleware)
   */
  async getUserName(userId) {
    try {
      logger.info({ userId }, "Service: Fetching user name");

      const user = await dashboardRepository.getUserById(userId);
      
      if (!user) {
        logger.warn({ userId }, "Service: User not found");
        throw new Error("User not found");
      }

      logger.info({ userId }, "Service: User name fetched successfully");

      return {
        id: user.id,
        name: user.name,
        email: user.email
      };

    } catch (error) {
      logger.error({ error: error.message, userId }, "Service: Error fetching user name");
      throw new Error(error.message);
    }
  }

  /**
   * Fetches only investment data (financial profile)
   * @param {number} userId - User ID (já validado pelo middleware)
   */
  async getInvestmentData(userId) {
    try {
      logger.info({ userId }, "Service: Fetching investment data");

      // Verify user exists
      const user = await dashboardRepository.getUserById(userId);
      if (!user) {
        logger.warn({ userId }, "Service: User not found");
        throw new Error("User not found");
      }

      // Fetch financial profile
      const financialProfile = await dashboardRepository.getFinancialProfileByUserId(userId);
      if (!financialProfile) {
        logger.warn({ userId }, "Service: Financial profile not found");
        throw new Error("Financial profile not found");
      }

      logger.info({ userId }, "Service: Investment data fetched successfully");

      return financialProfile;

    } catch (error) {
      logger.error({ error: error.message, userId }, "Service: Error fetching investment data");
      throw new Error(error.message);
    }
  }
}

export default new DashboardService();
