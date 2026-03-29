// Financial Profile Service - Doorkeeper pattern
// Orchestrates: Validators → Repositories
const perfilFinanceiroRepository = require("../repositories/perfilFinanceiroRepository");
const authRepository = require("../repositories/userRepository");
const perfilFinanceiroValidator = require("../validators/perfilFinanceiroValidator");
const logger = require("../utils/logger");

class PerfilFinanceiroService {
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
      const validation = perfilFinanceiroValidator.validateFinancialProfileRegistration(
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

      // Step 2.5: Map English names to Portuguese column names
      const mappedData = {
        renda_mensal: cleanedData.monthly_income || 0,
        saldo_inicial: cleanedData.initial_balance || 0,
        possui_investimentos: cleanedData.has_investments || false,
        possui_patrimonio: cleanedData.has_assets || false,
        objetivo_financeiro: cleanedData.financial_goal,
        perfil_comportamento: cleanedData.behavior_profile
      };

      // Step 3: Verify user exists in repository
      const user = await authRepository.findById(userId);
      if (!user) {
        logger.warn({ userId }, "Service: User not found for profile creation");
        throw new Error("User not found");
      }

      // Step 4: Check if profile already exists
      const existingProfile = await perfilFinanceiroRepository.findByUsuarioId(userId);
      if (existingProfile) {
        logger.info({ userId }, "Service: Profile exists, updating");
        // Update if exists
        const updated = await perfilFinanceiroRepository.update(userId, mappedData);
        if (!updated) {
          logger.error({ userId }, "Service: Error updating financial profile");
          throw new Error("Error updating financial profile");
        }
        logger.info({ userId, profileId: existingProfile.id }, "Service: Financial profile updated");
        return {
          id: existingProfile.id,
          user_id: userId,
          ...mappedData
        };
      }

      // Step 5: Create new profile via repository
      const profile = await perfilFinanceiroRepository.create(userId, mappedData);
      logger.info({ userId, profileId: profile.id }, "Service: Financial profile created successfully");
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
      const profile = await perfilFinanceiroRepository.findByUsuarioId(userId);
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
  


module.exports = new PerfilFinanceiroService();
