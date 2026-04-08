// Dashboard Controller - Simple request/response handler for dashboard GET endpoints
import { Request, Response } from "express";
import dashboardService from "../services/dashboard.service.js";
import DashboardResponseDTO from "../dtos/dashboard-response.dto.js";

class DashboardController {
  /**
   * GET /api/dashboard - Retorna dados completos da dashboard (usuário + investimentos)
   */
  async getDashboard(request: Request, response: Response): Promise<Response> {
    try {
      const userId: number = (request as any).user?.id;

      if (!userId) {
        return response.status(400).json({
          status: "error",
          message: "User identification failed"
        });
      }

      const dashboardData: any = await dashboardService.getDashboardData(userId);

      // Transform with output DTO
      const dashboardResponseDTO: any = DashboardResponseDTO.fromDashboardData(dashboardData);

      return response.status(200).json({
        status: "success",
        data: dashboardResponseDTO.toJSON()
      });

    } catch (error) {
      const errorMessage: string = error instanceof Error ? error.message : String(error);
      return response.status(404).json({
        status: "error",
        message: errorMessage
      });
    }
  }

  /**
   * GET /api/dashboard/name - Retorna apenas nome do usuário
   */
  async getUserName(request: Request, response: Response): Promise<Response> {
    try {
      const userId: number = (request as any).user?.id;

      if (!userId) {
        return response.status(400).json({
          status: "error",
          message: "User identification failed"
        });
      }

      const userData: any = await dashboardService.getUserName(userId);

      // Transform with output DTO
      const dashboardResponseDTO: any = DashboardResponseDTO.fromUserData(userData);

      return response.status(200).json({
        status: "success",
        data: dashboardResponseDTO.toJSON()
      });

    } catch (error) {
      const errorMessage: string = error instanceof Error ? error.message : String(error);
      return response.status(404).json({
        status: "error",
        message: errorMessage
      });
    }
  }

  /**
   * GET /api/dashboard/investments - Retorna dados de investimentos (perfil financeiro)
   */
  async getInvestments(request: Request, response: Response): Promise<Response> {
    try {
      const userId: number = (request as any).user?.id;

      if (!userId) {
        return response.status(400).json({
          status: "error",
          message: "User identification failed"
        });
      }

      const investmentData: any = await dashboardService.getInvestmentData(userId);

      // Transform with output DTO
      const dashboardResponseDTO: any = DashboardResponseDTO.fromInvestmentData(investmentData);

      return response.status(200).json({
        status: "success",
        data: dashboardResponseDTO.toJSON()
      });

    } catch (error) {
      const errorMessage: string = error instanceof Error ? error.message : String(error);
      return response.status(404).json({
        status: "error",
        message: errorMessage
      });
    }
  }
}

export default new DashboardController();
