// Financial Profile Controller - Simple request/response handler
const financialProfileService = require("../services/financial-profile.service");
const logger = require("../utils/logger");

class PerfilFinanceiroController {
  // Create financial profile
  async create(request, response) {
    try {
      const userId = request.user?.id;

      if (!userId) {
        logger.warn({}, "FinancialProfileController: User ID not found in token");
        return response.status(400).json({
          status: "error",
          message: "User identification failed"
        });
      }

      logger.info({ userId }, "Creating financial profile");

      // Service handles validation and persistence
      const profile = await financialProfileService.createProfile(userId, request.body);

      logger.info({ userId, profileId: profile.id }, "Financial profile created successfully");

      return response.status(201).json({
        status: "success",
        message: "Financial profile created successfully",
        profile
      });

    } catch (error) {
      logger.error({ 
        error: error.message, 
        userId: request.user?.id 
      }, "Error creating financial profile");
      
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

      logger.info({ userId }, "Fetching financial profile");

      // Service handles all validation
      const profile = await financialProfileService.getProfile(userId);

      logger.info({ userId }, "Financial profile fetched successfully");

      return response.status(200).json({
        status: "success",
        profile
      });

    } catch (error) {
      logger.error({ error: error.message, userId: request.params.userId }, "Error fetching financial profile");
      return response.status(404).json({
        status: "error",
        message: error.message
      });
    }
  }
}

module.exports = new PerfilFinanceiroController();
