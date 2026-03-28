// Financial Profile Service - Doorkeeper pattern
// Orchestrates: Validators → Repositories
const perfilFinanceiroRepository = require("../repositories/perfilFinanceiroRepository");
const authRepository = require("../repositories/authRepository");
const perfilFinanceiroValidator = require("../validators/perfilFinanceiroValidator");

class PerfilFinanceiroService {
  // Create user financial profile
  async createProfile(userId, profileData) {
    try {
      // Step 1: Validate userId
      if (!userId) {
        throw new Error("User ID is required");
      }

      // Step 2: Validate all profile data via validator
      const validation = perfilFinanceiroValidator.validateFinancialProfileRegistration(
        profileData.monthly_income,
        profileData.initial_balance,
        profileData.has_investments,
        profileData.has_assets,
        profileData.financial_goal,
        profileData.behavior_profile
      );

      if (!validation.isValid) {
        throw new Error(validation.errors.join(", "));
      }

      const cleanedData = validation.cleanedData;

      // Step 3: Verify user exists in repository
      const user = await authRepository.findById(userId);
      if (!user) {
        throw new Error("User not found");
      }

      // Step 4: Check if profile already exists
      const existingProfile = await perfilFinanceiroRepository.findByUsuarioId(userId);
      if (existingProfile) {
        // Update if exists
        const updated = await perfilFinanceiroRepository.update(userId, cleanedData);
        if (!updated) {
          throw new Error("Error updating financial profile");
        }
        return {
          id: existingProfile.id,
          user_id: userId,
          ...cleanedData
        };
      }

      // Step 5: Create new profile via repository
      const profile = await perfilFinanceiroRepository.create(userId, cleanedData);
      return profile;

    } catch (error) {
      throw new Error(error.message);
    }
  }

  // Get user financial profile
  async getProfile(userId) {
    try {
      // Step 1: Validate userId
      if (!userId) {
        throw new Error("User ID is required");
      }

      // Step 2: Fetch profile from repository
      const profile = await perfilFinanceiroRepository.findByUsuarioId(userId);
      if (!profile) {
        throw new Error("Financial profile not found");
      }

      // Step 3: Return profile
      return profile;

    } catch (error) {
      throw new Error(error.message);
    }
  }
}

module.exports = new PerfilFinanceiroService();
