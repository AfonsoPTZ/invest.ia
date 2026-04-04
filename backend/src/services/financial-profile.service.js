// Financial Profile Service - Doorkeeper pattern
// Orchestrates: Repositories
// Dados já vêm validados do middleware
const financialProfileRepository = require("../repositories/financial-profile.repository");
const userRepository = require("../repositories/user.repository");
const logger = require("../utils/logger");
const AppError = require("../utils/AppError");

class FinancialProfileService {
  // Create user financial profile
  // Dados já validados pelo middleware
  async createProfile(userId, profileData) {
    try {
      logger.info({ userId }, "Service: Starting financial profile creation");

      // Step 1: Validate userId
      if (!userId) {
        logger.warn({}, "Service: User ID not provided");
        throw new AppError("User ID is required", 400);
      }

      // Step 2: Verify user exists in repository
      const user = await userRepository.findById(userId);
      if (!user) {
        logger.warn({ userId }, "Service: User not found for profile creation");
        throw new AppError("User not found", 404);
      }

      // Step 3: Create or update profile via repository
      const profile = await financialProfileRepository.createOrUpdate(userId, profileData);
      logger.info({ userId, profileId: profile.id }, "Service: Financial profile saved successfully");
      return profile;

    } catch (error) {
      logger.error({ error: error.message, userId }, "Service: Error creating financial profile");
      throw error;
    }
  }

  // Get user financial profile
  async getProfile(userId) {
    try {
      logger.debug({ userId }, "Service: Fetching financial profile");

      // Step 1: Validate userId
      if (!userId) {
        logger.warn({}, "Service: User ID not provided");
        throw new AppError("User ID is required", 400);
      }

      // Step 2: Fetch profile from repository
      const profile = await financialProfileRepository.findByUserId(userId);
      if (!profile) {
        logger.warn({ userId }, "Service: Financial profile not found");
        throw new AppError("Financial profile not found", 404);
      }

      logger.debug({ userId }, "Service: Financial profile fetched successfully");
      // Step 3: Return profile
      return profile;

    } catch (error) {
      logger.error({ error: error.message, userId }, "Service: Error fetching financial profile");
      throw error;
    }
  }
}

module.exports = new FinancialProfileService();
