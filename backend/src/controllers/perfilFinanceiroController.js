// Financial Profile Controller - Simple request/response handler
const perfilFinanceiroService = require("../services/perfilFinanceiroService");

class PerfilFinanceiroController {
  // Create financial profile
  async create(request, response) {
    try {
      const { user_id } = request.body;

      // Service handles all validation
      const profile = await perfilFinanceiroService.createProfile(user_id, request.body);

      return response.status(201).json({
        status: "success",
        message: "Financial profile created successfully",
        profile
      });

    } catch (error) {
      console.error("Error creating financial profile:", error.message);
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
      const profile = await perfilFinanceiroService.getProfile(userId);

      return response.status(200).json({
        status: "success",
        profile
      });

    } catch (error) {
      console.error("Error fetching financial profile:", error.message);
      return response.status(404).json({
        status: "error",
        message: error.message
      });
    }
  }
}

module.exports = new PerfilFinanceiroController();
