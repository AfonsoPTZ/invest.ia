// Dashboard Controller - Simple request/response handler for dashboard GET endpoints
const dashboardService = require("../services/dashboardService");
const logger = require("../utils/logger");

class DashboardController {
  /**
   * GET /api/dashboard - Retorna dados completos da dashboard (usuário + investimentos)
   */
  async getDashboard(request, response) {
    try {
      const userId = request.user?.id;

      if (!userId) {
        logger.warn({}, "DashboardController: User ID not found in token");
        return response.status(400).json({
          status: "error",
          message: "User identification failed"
        });
      }

      logger.info({ userId }, "Fetching dashboard data");

      const dashboardData = await dashboardService.getDashboardData(userId);

      logger.info({ userId }, "Dashboard data fetched successfully");

      return response.status(200).json({
        status: "success",
        data: dashboardData
      });

    } catch (error) {
      logger.error({ error: error.message, userId: request.user?.id }, "Error fetching dashboard data");
      return response.status(404).json({
        status: "error",
        message: error.message
      });
    }
  }

  /**
   * GET /api/dashboard/name - Retorna apenas nome do usuário
   */
  async getUserName(request, response) {
    try {
      const userId = request.user?.id;

      if (!userId) {
        logger.warn({}, "DashboardController: User ID not found in token");
        return response.status(400).json({
          status: "error",
          message: "User identification failed"
        });
      }

      logger.info({ userId }, "Fetching user name");

      const userData = await dashboardService.getUserName(userId);

      logger.info({ userId }, "User name fetched successfully");

      return response.status(200).json({
        status: "success",
        data: userData
      });

    } catch (error) {
      logger.error({ error: error.message, userId: request.user?.id }, "Error fetching user name");
      return response.status(404).json({
        status: "error",
        message: error.message
      });
    }
  }

  /**
   * GET /api/dashboard/investments - Retorna dados de investimentos (perfil financeiro)
   */
  async getInvestments(request, response) {
    try {
      const userId = request.user?.id;

      if (!userId) {
        logger.warn({}, "DashboardController: User ID not found in token");
        return response.status(400).json({
          status: "error",
          message: "User identification failed"
        });
      }

      logger.info({ userId }, "Fetching investment data");

      const investmentData = await dashboardService.getInvestmentData(userId);

      logger.info({ userId }, "Investment data fetched successfully");

      return response.status(200).json({
        status: "success",
        data: investmentData
      });

    } catch (error) {
      logger.error({ error: error.message, userId: request.user?.id }, "Error fetching investment data");
      return response.status(404).json({
        status: "error",
        message: error.message
      });
    }
  }
}

module.exports = new DashboardController();
