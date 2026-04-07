// Financial Profile Controller - Simple request/response handler
import financialProfileService from "../services/financial-profile.service.js";
import FinancialProfileDTO from "../dtos/financial-profile.dto.js";
import FinancialProfileResponseDTO from "../dtos/financial-profile-response.dto.js";

class FinancialProfileController {
  // Create financial profile
  async create(request, response) {
    try {
      const userId = request.user?.id;

      if (!userId) {
        return response.status(400).json({
          status: "error",
          message: "User identification failed"
        });
      }

      // Criar DTO dos dados validados pelo middleware
      const profileDTO = FinancialProfileDTO.fromRequest(request.validatedData || request.body);
      
      const profile = await financialProfileService.createProfile(userId, profileDTO.toJSON());

      // Transform with output DTO to standardize response
      const profileResponseDTO = FinancialProfileResponseDTO.fromProfile(profile);

      return response.status(201).json({
        status: "success",
        message: "Financial profile created successfully",
        profile: profileResponseDTO.toJSON()
      });

    } catch (error) {
      return response.status(400).json({
        status: "error",
        message: error.message
      });
    }
  }

  // Get financial profile
  async get(request, response) {
    try {
      const { userId } = request.params;

      // Service handles all validation
      const profile = await financialProfileService.getProfile(userId);

      // Transform with output DTO to standardize response
      const profileResponseDTO = FinancialProfileResponseDTO.fromProfile(profile);

      return response.status(200).json({
        status: "success",
        profile: profileResponseDTO.toJSON()
      });

    } catch (error) {
      return response.status(404).json({
        status: "error",
        message: error.message
      });
    }
  }
}

export default new FinancialProfileController();
