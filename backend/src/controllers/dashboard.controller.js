// Dashboard Controller - Simple request/response handler for dashboard GET endpoints
import dashboardService from "../services/dashboard.service.js";
import DashboardResponseDTO from "../dtos/dashboard-response.dto.js";

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

      // Transform with output DTO
      const dashboardResponseDTO = DashboardResponseDTO.fromDashboardData(dashboardData);

      return response.status(200).json({
        status: "success",
        data: dashboardResponseDTO.toJSON()
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

      // Transform with output DTO
      const dashboardResponseDTO = DashboardResponseDTO.fromUserData(userData);

      return response.status(200).json({
        status: "success",
        data: dashboardResponseDTO.toJSON()
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

      // Transform with output DTO
      const dashboardResponseDTO = DashboardResponseDTO.fromInvestmentData(investmentData);

      return response.status(200).json({
        status: "success",
        data: dashboardResponseDTO.toJSON()
      });

    } catch (error) {
      return response.status(404).json({
        status: "error",
        message: error.message
      });
    }
  }
}

export default new DashboardController();
