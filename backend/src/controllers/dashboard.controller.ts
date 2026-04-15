// Dashboard Controller - Simple request/response handler for dashboard GET endpoints
import { Request, Response } from "express";
import dashboardService from "../services/dashboard.service.js";
import DashboardResponseDTO from "../dtos/dashboard-response.dto.js";

class DashboardController {
  /**
   * GET /api/dashboard - Retorna dados completos da dashboard (usuário + investimentos)
   */
  async getDashboard(request: Request, response: Response): Promise<Response> {
    const userId: number = (request as any).user.id;

    const dashboardData: any = await dashboardService.getDashboardData(userId);

    // Transform with output DTO
    const dashboardResponseDTO: any = DashboardResponseDTO.fromDashboardData(dashboardData);

    return response.status(200).json({
      success: true,
      message: "Dashboard data retrieved successfully",
      data: dashboardResponseDTO.toJSON()
    });
  }

  /**
   * GET /api/dashboard/name - Retorna apenas nome do usuário
   */
  async getUserName(request: Request, response: Response): Promise<Response> {
    const userId: number = (request as any).user.id;

    const userData: any = await dashboardService.getUserName(userId);

    // Transform with output DTO
    const dashboardResponseDTO: any = DashboardResponseDTO.fromUserData(userData);

    return response.status(200).json({
      success: true,
      message: "User name retrieved successfully",
      data: dashboardResponseDTO.toJSON()
    });
  }

  /**
   * GET /api/dashboard/investments - Retorna dados de investimentos (perfil financeiro)
   */
  async getInvestments(request: Request, response: Response): Promise<Response> {
    const userId: number = (request as any).user.id;

    const investmentData: any = await dashboardService.getInvestmentData(userId);

    // Transform with output DTO
    const dashboardResponseDTO: any = DashboardResponseDTO.fromInvestmentData(investmentData);

    return response.status(200).json({
      success: true,
      message: "Investment data retrieved successfully",
      data: dashboardResponseDTO.toJSON()
    });
  }
}

export default new DashboardController();
