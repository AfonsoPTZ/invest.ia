// Dashboard Service - Doorkeeper pattern
// Orchestrates: Repository calls for dashboard data
import dashboardRepository from "../repositories/dashboard.repository.js";
import AppError from "../utils/AppError.js";
import logger from "../utils/logger.js";
import type { IDashboardUser, IDashboardFinancialProfile, IDashboardData } from "../repositories/dashboard.repository.js";

/**
 * Interface para nome de usuário
 */
interface IUserName {
  id: number;
  name: string;
  email: string;
}

class DashboardService {
  /**
   * Fetches complete dashboard data: user + financial profile
   * @param {number} userId - User ID (já validado pelo middleware)
   */
  async getDashboardData(userId: number): Promise<IDashboardData | null> {
    try {
      logger.info({ userId }, "Service: Starting dashboard data retrieval");

      // Repository faz os GETs
      const dashboardData = await dashboardRepository.getDashboardData(userId);
      
      if (!dashboardData) {
        logger.warn({ userId }, "Service: Dashboard data not found");
        throw new AppError("Dashboard data not found", 404);
      }

      logger.info({ userId }, "Service: Dashboard data retrieved successfully");

      return {
        user: dashboardData.user,
        financialProfile: dashboardData.financialProfile
      };

    } catch (error) {
      if (error instanceof AppError) throw error;
      const errorMessage: string = error instanceof Error ? error.message : String(error);
      logger.error({ error: errorMessage, userId }, "Service: Error retrieving dashboard data");
      throw new AppError(errorMessage, 500);
    }
  }

  /**
   * Fetches only user name
   * @param {number} userId - User ID (já validado pelo middleware)
   */
  async getUserName(userId: number): Promise<IUserName> {
    try {
      logger.info({ userId }, "Service: Fetching user name");

      const user = await dashboardRepository.getUserById(userId);
      
      if (!user) {
        logger.warn({ userId }, "Service: User not found");
        throw new AppError("User not found", 404);
      }

      logger.info({ userId }, "Service: User name fetched successfully");

      return {
        id: user.id,
        name: user.name,
        email: user.email
      };

    } catch (error) {
      if (error instanceof AppError) throw error;
      const errorMessage: string = error instanceof Error ? error.message : String(error);
      logger.error({ error: errorMessage, userId }, "Service: Error fetching user name");
      throw new AppError(errorMessage, 500);
    }
  }

  /**
   * Fetches only investment data (financial profile)
   * @param {number} userId - User ID (já validado pelo middleware)
   */
  async getInvestmentData(userId: number): Promise<IDashboardFinancialProfile> {
    try {
      logger.info({ userId }, "Service: Fetching investment data");

      // Verify user exists
      const user = await dashboardRepository.getUserById(userId);
      if (!user) {
        logger.warn({ userId }, "Service: User not found");
        throw new AppError("User not found", 404);
      }

      // Fetch financial profile
      const financialProfile = await dashboardRepository.getFinancialProfileByUserId(userId);
      if (!financialProfile) {
        logger.warn({ userId }, "Service: Financial profile not found");
        throw new AppError("Financial profile not found", 404);
      }

      logger.info({ userId }, "Service: Investment data fetched successfully");

      return financialProfile;

    } catch (error) {
      if (error instanceof AppError) throw error;
      const errorMessage: string = error instanceof Error ? error.message : String(error);
      logger.error({ error: errorMessage, userId }, "Service: Error fetching investment data");
      throw new AppError(errorMessage, 500);
    }
  }
}

export default new DashboardService();
export type { IUserName };
