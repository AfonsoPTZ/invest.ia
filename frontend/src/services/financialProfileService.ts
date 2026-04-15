/**
 * Financial Profile Service (TypeScript)
 * 
 * Centralized HTTP client for financial profile operations
 * Fully typed with API contract interfaces
 * Handles creation and retrieval of user financial profiles
 * Requires temporary token from email verification for creation
 * 
 * @module financialProfileService
 */

import logger from "../utils/logger";
import { API_URL, getJsonHeaders, getAuthHeaders } from "../config/api";
import type {
  FinancialProfile,
  FinancialProfileRequest,
  FinancialProfileResponse,
  ApiResponse
} from "../types/api";

/**
 * Create or update user financial profile
 * 
 * Final step of registration. User provides financial details.
 * Retrieves temporary token from sessionStorage (stored after email verification)
 * 
 * @async
 * @param {FinancialProfileRequest} profileData - Financial profile data
 * @returns {Promise<FinancialProfileResponse>} { success, message, userId, profileId }
 * @throws {Error} Profile creation error from API or network
 */
export async function createFinancialProfile(
  profileData: FinancialProfileRequest
): Promise<FinancialProfileResponse> {
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
      headers: getJsonHeaders(token),
      body: JSON.stringify(profileData)
    });

    const data: ApiResponse<FinancialProfileResponse> = await response.json();

    if (!data.success) {
      logger.warn({}, `FinancialProfileService: Profile creation failed - ${data.message}`);
      throw new Error(data.message || "Profile creation error");
    }

    logger.info({ userId: data.data?.userId }, "FinancialProfileService: Financial profile created successfully");

    // Clean up temporary token after successful profile creation
    sessionStorage.removeItem("tempProfileToken");

    return data.data as FinancialProfileResponse;
  } catch (error) {
    logger.error({ error: error instanceof Error ? error.message : String(error) }, "FinancialProfileService: Error on profile creation");
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
 * @returns {Promise<FinancialProfile>} Financial profile data
 * @throws {Error} Profile fetch error from API or network
 */
export async function getFinancialProfile(): Promise<FinancialProfile> {
  const token = localStorage.getItem("token");

  try {
    if (!token) {
      logger.warn({}, "FinancialProfileService: Token not found for getFinancialProfile");
      throw new Error("Token not found");
    }

    logger.debug({}, "FinancialProfileService: Fetching financial profile");

    const response = await fetch(`${API_URL}/financial-profile`, {
      headers: getAuthHeaders(token)
    });

    const data: ApiResponse<FinancialProfile> = await response.json();

    if (!data.success) {
      logger.warn({}, `FinancialProfileService: Fetch failed - ${data.message}`);
      throw new Error(data.message || "Fetch profile error");
    }

    logger.info({}, "FinancialProfileService: Financial profile fetched successfully");

    return data.data as FinancialProfile;
  } catch (error) {
    logger.error({ error: error instanceof Error ? error.message : String(error) }, "FinancialProfileService: Error fetching profile");
    throw error;
  }
}

/**
 * Update user's financial profile
 * 
 * Updates existing profile with new financial data
 * Requires valid JWT token
 * 
 * @async
 * @param {Partial<FinancialProfileRequest>} profileData - Profile fields to update
 * @returns {Promise<FinancialProfile>} Updated financial profile
 * @throws {Error} Profile update error from API or network
 */
export async function updateFinancialProfile(
  profileData: Partial<FinancialProfileRequest>
): Promise<FinancialProfile> {
  const token = localStorage.getItem("token");

  try {
    if (!token) {
      logger.warn({}, "FinancialProfileService: Token not found for updateFinancialProfile");
      throw new Error("Token not found");
    }

    logger.info({}, "FinancialProfileService: Attempting to update financial profile");

    const response = await fetch(`${API_URL}/financial-profile`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(profileData)
    });

    const data: ApiResponse<FinancialProfile> = await response.json();

    if (!data.success) {
      logger.warn({}, `FinancialProfileService: Update failed - ${data.message}`);
      throw new Error(data.message || "Profile update error");
    }

    logger.info({}, "FinancialProfileService: Financial profile updated successfully");

    return data.data as FinancialProfile;
  } catch (error) {
    logger.error({ error: error instanceof Error ? error.message : String(error) }, "FinancialProfileService: Error updating profile");
    throw error;
  }
}

/**
 * Delete user's financial profile
 * 
 * Removes financial profile for authenticated user
 * Requires valid JWT token
 * 
 * @async
 * @returns {Promise<void>}
 * @throws {Error} Profile delete error from API or network
 */
export async function deleteFinancialProfile(): Promise<void> {
  const token = localStorage.getItem("token");

  try {
    if (!token) {
      logger.warn({}, "FinancialProfileService: Token not found for deleteFinancialProfile");
      throw new Error("Token not found");
    }

    logger.info({}, "FinancialProfileService: Attempting to delete financial profile");

    const response = await fetch(`${API_URL}/financial-profile`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });

    const data: ApiResponse<unknown> = await response.json();

    if (!data.success) {
      logger.warn({}, `FinancialProfileService: Delete failed - ${data.message}`);
      throw new Error(data.message || "Profile delete error");
    }

    logger.info({}, "FinancialProfileService: Financial profile deleted successfully");
  } catch (error) {
    logger.error({ error: error instanceof Error ? error.message : String(error) }, "FinancialProfileService: Error deleting profile");
    throw error;
  }
}
