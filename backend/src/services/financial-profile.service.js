// Financial Profile Service - Doorkeeper pattern
// Orchestrates: Validators → Repositories
const financialProfileRepository = require("../repositories/financial-profile.repository");
const userRepository = require("../repositories/user.repository");
const financialProfileValidator = require("../validators/financial-profile.validator");
const logger = require("../utils/logger");

class FinancialProfileService {
  // Create user financial profile
  async createProfile(userId, profileData) {
    try {
      logger.info({ userId }, "Service: Starting financial profile creation");

      // Step 1: Validate userId
      if (!userId) {
        logger.warn({}, "Service: User ID not provided");
        throw new Error("User ID is required");
      }

      // Step 2: Validate all profile data via validator
      const validation = financialProfileValidator.validateFinancialProfileRegistration(
        profileData.monthly_income,
        profileData.initial_balance,
        profileData.has_investments,
        profileData.has_assets,
        profileData.financial_goal,
        profileData.behavior_profile
      );

      if (!validation.isValid) {
        logger.warn({ userId, errors: validation.errors }, "Service: Financial profile validation failed");
        throw new Error(validation.errors.join(", "));
      }

      const cleanedData = validation.cleanedData;

      // Step 3: Verify user exists in repository
      const user = await userRepository.findById(userId);
      if (!user) {
        logger.warn({ userId }, "Service: User not found for profile creation");
        throw new Error("User not found");
      }

      // Step 4: Create or update profile via repository
      const profile = await financialProfileRepository.createOrUpdate(userId, cleanedData);
      logger.info({ userId, profileId: profile.id }, "Service: Financial profile saved successfully");
      return profile;

    } catch (error) {
      logger.error({ error: error.message, userId }, "Service: Error creating financial profile");
      throw new Error(error.message);
    }
  }

  // Get user financial profile
  async getProfile(userId) {
    try {
      logger.debug({ userId }, "Service: Fetching financial profile");

      // Step 1: Validate userId
      if (!userId) {
        logger.warn({}, "Service: User ID not provided");
        throw new Error("User ID is required");
      }

      // Step 2: Fetch profile from repository
      const profile = await financialProfileRepository.findByUserId(userId);
      if (!profile) {
        logger.warn({ userId }, "Service: Financial profile not found");
        throw new Error("Financial profile not found");
      }

      logger.debug({ userId }, "Service: Financial profile fetched successfully");
      // Step 3: Return profile
      return profile;

    } catch (error) {
      logger.error({ error: error.message, userId }, "Service: Error fetching financial profile");
      throw new Error(error.message);
    }
  }
}

module.exports = new FinancialProfileService();
