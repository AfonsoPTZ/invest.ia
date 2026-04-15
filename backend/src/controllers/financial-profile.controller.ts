// Financial Profile Controller - Simple request/response handler
import { Request, Response } from "express";
import financialProfileService from "../services/financial-profile.service.js";
import FinancialProfileDTO from "../dtos/financial-profile.dto.js";
import FinancialProfileResponseDTO from "../dtos/financial-profile-response.dto.js";

class FinancialProfileController {
  /**
   * Create financial profile
   */
  async create(request: Request, response: Response): Promise<Response> {
    try {
      const userId: number = (request as any).user?.id;

      if (!userId) {
        return response.status(400).json({
          success: false,
          message: "User identification failed",
          error: "User identification failed"
        });
      }

      // Criar DTO dos dados validados pelo middleware
      const profileDTO: any = FinancialProfileDTO.fromRequest((request as any).validatedData || request.body);
      
      const profile: any = await financialProfileService.createProfile(userId, profileDTO.toJSON());

      // Transform with output DTO to standardize response
      const profileResponseDTO: any = FinancialProfileResponseDTO.fromProfile(profile);

      return response.status(201).json({
        success: true,
        message: "Financial profile created successfully",
        data: profileResponseDTO.toJSON()
      });

    } catch (error) {
      const errorMessage: string = error instanceof Error ? error.message : String(error);
      return response.status(400).json({
        success: false,
        message: errorMessage,
        error: errorMessage
      });
    }
  }

  /**
   * Get financial profile
   */
  async get(request: Request, response: Response): Promise<Response> {
    try {
      const { userId } = request.params;
      const userIdNum: number = parseInt(userId || "0", 10);

      // Service handles all validation
      const profile: any = await financialProfileService.getProfile(userIdNum);

      // Transform with output DTO to standardize response
      const profileResponseDTO: any = FinancialProfileResponseDTO.fromProfile(profile);

      return response.status(200).json({
        success: true,
        message: "Financial profile retrieved successfully",
        data: profileResponseDTO.toJSON()
      });

    } catch (error) {
      const errorMessage: string = error instanceof Error ? error.message : String(error);
      return response.status(404).json({
        success: false,
        message: errorMessage,
        error: errorMessage
      });
    }
  }
}

export default new FinancialProfileController();
