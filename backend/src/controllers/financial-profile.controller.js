// Financial Profile Controller - Simple request/response handler
const financialProfileService = require("../services/financial-profile.service");

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

      // Data already validated by middleware
      const profile = await financialProfileService.createProfile(userId, request.validatedData || request.body);

      return response.status(201).json({
        status: "success",
        message: "Financial profile created successfully",
        profile
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

      return response.status(200).json({
        status: "success",
        profile
      });

    } catch (error) {
      return response.status(404).json({
        status: "error",
        message: error.message
      });
    }
  }
}

module.exports = new FinancialProfileController();
