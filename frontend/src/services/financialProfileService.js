/**
 * Financial Profile Service
 * 
 * HTTP client for financial profile operations
 * Handles creation and retrieval of user financial profiles
 * Requires temporary token from email verification
 * 
 * @module financialProfileService
 */

import logger from "../utils/logger";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

/**
 * Create or update user financial profile
 * 
 * Final step of registration. User provides financial details.
 * Retrieves temporary token from sessionStorage (stored after email verification)
 * 
 * @async
 * @param {Object} profileData - Financial profile data
 * @param {number} profileData.monthly_income - User's monthly income
 * @param {number} profileData.initial_balance - User's initial savings/patrimony
 * @param {boolean} profileData.has_investments - Has investment experience
 * @param {boolean} profileData.has_assets - Owns other assets
 * @param {string} profileData.financial_goal - User's main financial goal
 * @param {string} profileData.behavior_profile - Investment risk level (conservative/moderate/aggressive)
 * @returns {Promise<Object>} { success, message, userId }
 * @throws {Error} Profile creation error from API or network
 */
export async function createFinancialProfile(profileData) {
  try {
    // Retrieve temporary token from sessionStorage (from email verification step)
    const token = sessionStorage.getItem("tempProfileToken");

    if (!token) {
      logger.warn({}, "FinancialProfileService: Temporary token not found");
      throw new Error("Token expired. Please register again.");
    }

    logger.info({}, "FinancialProfileService: Attempting to create financial profile");

    const response = await fetch(`${API_URL}/financial-profile`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(profileData)
    });

    const data = await response.json();

    if (!response.ok) {
      logger.warn({}, `FinancialProfileService: Profile creation failed - ${data.message}`);
      throw new Error(data.message || "Profile creation error");
    }

    logger.info({ userId: data.userId }, "FinancialProfileService: Financial profile created successfully");

    return data;
  } catch (error) {
    logger.error({ error: error.message }, "FinancialProfileService: Error on profile creation");
    throw error;
  }
}

/**
 * Get user's financial profile
 * 
 * Retrieves financial profile for authenticated user
 * Retrieves JWT token from localStorage (after user logs in)
 * 
 * @async
 * @returns {Promise<Object>} Financial profile data
 * @throws {Error} Profile fetch error from API or network
 */
export async function getFinancialProfile() {
  const token = localStorage.getItem("token");

  try {
    if (!token) {
      logger.warn({}, "FinancialProfileService: Token not found for getFinancialProfile");
      throw new Error("Token not found");
    }

    logger.debug({}, "FinancialProfileService: Fetching financial profile");

    const response = await fetch(`${API_URL}/financial-profile`, {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });

    const data = await response.json();

    if (!response.ok) {
      logger.warn({}, `FinancialProfileService: Fetch failed - ${data.message}`);
      throw new Error(data.message || "Fetch profile error");
    }

    logger.info({}, "FinancialProfileService: Financial profile fetched successfully");

    return data;
  } catch (error) {
    logger.error({ error: error.message }, "FinancialProfileService: Error fetching profile");
    throw error;
  }
}
