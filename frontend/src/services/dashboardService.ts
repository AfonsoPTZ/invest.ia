/**
 * Dashboard Service (TypeScript)
 * 
 * Centralized HTTP client for dashboard data operations
 * Fully typed with API contract interfaces
 * Fetches user information, financial profiles, and related data
 * Utilizes frontend logger for debugging
 * 
 * Layer Responsibility:
 * - HTTP communication only (fetch, headers, response handling)
 * - Token retrieval from localStorage
 * - Error transformation to/from API format
 * - Type-safe API interactions
 * 
 * DO NOT:
 * - Business logic (calculations, aggregations)
 * - UI state management
 * - Page redirects
 * 
 * @module dashboardService
 */

import logger from "../utils/logger";
import type {
  DashboardResponse,
  DashboardNameResponse,
  User,
  FinancialProfile,
  ApiResponse
} from "../types/api";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

/**
 * Get user name only
 * 
 * Lightweight endpoint returning only user name
 * Used for quick display on navbar/header
 * Requires valid JWT token
 * 
 * @async
 * @returns {Promise<DashboardNameResponse>} { id, name, email }
 * @throws {Error} If not authenticated or API error
 */
export async function getDashboardName(): Promise<DashboardNameResponse> {
  const token = localStorage.getItem("token");

  try {
    if (!token) {
      logger.warn({}, "DashboardService: Token not found for getDashboardName");
      throw new Error("Token not found");
    }

    logger.debug({}, "DashboardService: Fetching user name");

    const response = await fetch(`${API_URL}/dashboard/name`, {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });

    const data: ApiResponse<DashboardNameResponse> = await response.json();

    if (!response.ok) {
      logger.warn({}, `DashboardService: getDashboardName failed - ${data.message}`);
      throw new Error(data.message || "Error fetching user name");
    }

    logger.info({}, "DashboardService: User name fetched successfully");

    return data.data as DashboardNameResponse;
  } catch (error) {
    logger.error({ error: error instanceof Error ? error.message : String(error) }, "DashboardService: Error fetching user name");
    throw error;
  }
}

/**
 * Get complete dashboard data
 * 
 * Includes user information and financial profile
 * Used on first dashboard load for all stats
 * Requires valid JWT token
 * 
 * @async
 * @returns {Promise<DashboardResponse>} { user, financialProfile }
 * @throws {Error} If not authenticated or API error
 */
export async function getDashboardData(): Promise<DashboardResponse> {
  const token = localStorage.getItem("token");

  try {
    if (!token) {
      logger.warn({}, "DashboardService: Token not found for getDashboardData");
      throw new Error("Token not found");
    }

    logger.debug({}, "DashboardService: Fetching dashboard data");

    const response = await fetch(`${API_URL}/dashboard`, {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });

    const data: ApiResponse<DashboardResponse> = await response.json();

    if (!response.ok) {
      logger.warn({}, `DashboardService: getDashboardData failed - ${data.message}`);
      throw new Error(data.message || "Error fetching dashboard data");
    }

    logger.info({}, "DashboardService: Dashboard data fetched successfully");

    return data.data as DashboardResponse;
  } catch (error) {
    logger.error({ error: error instanceof Error ? error.message : String(error) }, "DashboardService: Error fetching dashboard data");
    throw error;
  }
}

/**
 * Extract just user data from dashboard
 * Convenience method when only user is needed
 * 
 * @async
 * @returns {Promise<User>} User data
 * @throws {Error} If not authenticated or API error
 */
export async function getDashboardUser(): Promise<User> {
  const dashboardData = await getDashboardData();
  
  if (!dashboardData.user) {
    throw new Error("User data not available in dashboard");
  }
  
  return dashboardData.user;
}

/**
 * Extract just financial profile from dashboard
 * Convenience method when only profile is needed
 * 
 * @async
 * @returns {Promise<FinancialProfile>} Financial profile data
 * @throws {Error} If not authenticated, no profile, or API error
 */
export async function getDashboardProfile(): Promise<FinancialProfile> {
  const dashboardData = await getDashboardData();
  
  if (!dashboardData.financialProfile) {
    throw new Error("Financial profile not available or not set up yet");
  }
  
  return dashboardData.financialProfile;
}
