// Financial Profile Service - Doorkeeper pattern
// Orchestrates: Repositories
// Dados já vêm validados do middleware
import financialProfileRepository from "../repositories/financial-profile.repository.js";
import userRepository from "../repositories/user.repository.js";
import logger from "../utils/logger.js";
import AppError from "../utils/AppError.js";
import type { IProfileData, IProfileResponse } from "../repositories/financial-profile.repository.js";

class FinancialProfileService {
  /**
   * Create user financial profile
   * Dados já validados pelo middleware
   */
  async createProfile(userId: number, profileData: IProfileData): Promise<IProfileResponse | object> {
    try {
      logger.info({ userId }, "Service: Starting financial profile creation");

      // Step 1: Validate userId
      if (!userId) {
        logger.warn({}, "Service: User ID not provided");
        throw new AppError("User ID is required", 400);
      }

      // Step 2: Verify user exists in repository
      const user: any = await userRepository.findById(userId);
      if (!user) {
        logger.warn({ userId }, "Service: User not found for profile creation");
        throw new AppError("User not found", 404);
      }

      // Step 3: Check if profile exists, create or update
      const existingProfile = await financialProfileRepository.findByUserId(userId);
      
      let profile: any;
      if (existingProfile) {
        // Profile exists, update it
        logger.info({ userId }, "Service: Profile exists, updating");
        await financialProfileRepository.update(userId, profileData);
        profile = await financialProfileRepository.findByUserId(userId);
      } else {
        // Profile doesn't exist, create it
        logger.info({ userId }, "Service: Profile does not exist, creating");
        profile = await financialProfileRepository.create(userId, profileData);
      }

      logger.info({ userId, profileId: profile.id }, "Service: Financial profile saved successfully");
      return profile;

    } catch (error) {
      const errorMessage: string = error instanceof Error ? error.message : String(error);
      logger.error({ error: errorMessage, userId }, "Service: Error creating financial profile");
      throw error;
    }
  }

  /**
   * Get user financial profile
   */
  async getProfile(userId: number): Promise<IProfileResponse> {
    try {
      logger.debug({ userId }, "Service: Fetching financial profile");

      // Step 1: Validate userId
      if (!userId) {
        logger.warn({}, "Service: User ID not provided");
        throw new AppError("User ID is required", 400);
      }

      // Step 2: Fetch profile from repository
      const profile: any = await financialProfileRepository.findByUserId(userId);
      if (!profile) {
        logger.warn({ userId }, "Service: Financial profile not found");
        throw new AppError("Financial profile not found", 404);
      }

      logger.debug({ userId }, "Service: Financial profile fetched successfully");
      // Step 3: Return profile
      return profile;

    } catch (error) {
      const errorMessage: string = error instanceof Error ? error.message : String(error);
      logger.error({ error: errorMessage, userId }, "Service: Error fetching financial profile");
      throw error;
    }
  }
}

export default new FinancialProfileService();
