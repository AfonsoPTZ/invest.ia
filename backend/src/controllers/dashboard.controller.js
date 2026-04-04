// Dashboard Controller - Simple request/response handler for dashboard GET endpoints
const dashboardService = require("../services/dashboard.service");

class DashboardController {
  /**
   * GET /api/dashboard - Retorna dados completos da dashboard (usuário + investimentos)
   */
  async getDashboard(request, response) {
    try {
      const userId = request.user?.id;

      if (!userId) {
        return response.status(400).json({
          status: "error",
          message: "User identification failed"
        });
      }

      const dashboardData = await dashboardService.getDashboardData(userId);

      return response.status(200).json({
        status: "success",
        data: dashboardData
      });

    } catch (error) {
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
        return response.status(400).json({
          status: "error",
          message: "User identification failed"
        });
      }

      const userData = await dashboardService.getUserName(userId);

      return response.status(200).json({
        status: "success",
        data: userData
      });

    } catch (error) {
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
        return response.status(400).json({
          status: "error",
          message: "User identification failed"
        });
      }

      const investmentData = await dashboardService.getInvestmentData(userId);

      return response.status(200).json({
        status: "success",
        data: investmentData
      });

    } catch (error) {
      return response.status(404).json({
        status: "error",
        message: error.message
      });
    }
  }
}

module.exports = new DashboardController();
