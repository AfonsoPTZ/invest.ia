// Dashboard Service - Handles all dashboard data fetching
import logger from "../utils/logger";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

// Get user name only
export async function getDashboardName() {
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

    const data = await response.json();

    if (!response.ok) {
      logger.warn({}, `DashboardService: getDashboardName failed - ${data.message}`);
      throw new Error(data.message || "Error fetching user name");
    }

    logger.info({}, "DashboardService: User name fetched successfully");

    return data.data;
  } catch (error) {
    logger.error({ error: error.message }, "DashboardService: Error fetching user name");
    throw error;
  }
}

// Get dashboard data (user + financial profile)
export async function getDashboardData() {
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

    const data = await response.json();

    if (!response.ok) {
      logger.warn({}, `DashboardService: getDashboardData failed - ${data.message}`);
      throw new Error(data.message || "Error fetching dashboard data");
    }

    logger.info({}, "DashboardService: Dashboard data fetched successfully");

    return data.data;
  } catch (error) {
    logger.error({ error: error.message }, "DashboardService: Error fetching dashboard data");
    throw error;
  }
}

// Get investments only
export async function getDashboardInvestments() {
  const token = localStorage.getItem("token");

  try {
    if (!token) {
      logger.warn({}, "DashboardService: Token not found for getDashboardInvestments");
      throw new Error("Token not found");
    }

    logger.debug({}, "DashboardService: Fetching investment data");

    const response = await fetch(`${API_URL}/dashboard/investments`, {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });

    const data = await response.json();

    if (!response.ok) {
      logger.warn({}, `DashboardService: getDashboardInvestments failed - ${data.message}`);
      throw new Error(data.message || "Error fetching investment data");
    }

    logger.info({}, "DashboardService: Investment data fetched successfully");

    return data.data;
  } catch (error) {
    logger.error({ error: error.message }, "DashboardService: Error fetching investment data");
    throw error;
  }
}
