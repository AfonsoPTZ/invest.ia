/**
 * Expense Service
 * 
 * HTTP client for expense management operations
 * Handles CRUD operations for user expenses
 * 
 * Layer Responsibility:
 * - HTTP communication only (fetch, headers, response handling)
 * - Token retrieval from localStorage
 * - Error transformation to/from API format
 * 
 * DO NOT:
 * - Business logic (calculations, filtering)
 * - UI state management
 * - Page redirects
 * 
 * @module despesaService
 */

import logger from "../utils/logger";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

/**
 * Get all expenses for authenticated user
 * 
 * Fetches list of expenses with optional filtering/pagination
 * Requires valid JWT token
 * 
 * @async
 * @returns {Promise<Object>} { expenses: Array, total: number, ... }
 * @throws {Error} If not authenticated or API error
 */
export async function getExpenses() {
  const token = localStorage.getItem("token");

  try {
    if (!token) {
      logger.warn({}, "ExpenseService: Token not found");
      throw new Error("Token not found");
    }

    logger.debug({}, "ExpenseService: Fetching expenses");

    const response = await fetch(`${API_URL}/despesas`, {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });

    const data = await response.json();

    if (!response.ok) {
      logger.warn({}, `ExpenseService: getExpenses failed - ${data.message}`);
      throw new Error(data.message || "Error fetching expenses");
    }

    logger.info({}, "ExpenseService: Expenses fetched successfully");

    return data.data;
  } catch (error) {
    logger.error({ error: error.message }, "ExpenseService: Error fetching expenses");
    throw error;
  }
}


/**
 * Create new expense
 * 
 * @async
 * @param {Object} expenseData - Expense data object
 * @returns {Promise<Object>} Created expense object with ID
 * @throws {Error} If not authenticated, validation failed, or API error
 */
export async function createExpense(expenseData) {
  const token = localStorage.getItem("token");

  try {
    if (!token) {
      logger.warn({}, "ExpenseService: Token not found");
      throw new Error("Token not found");
    }

    logger.debug({}, "ExpenseService: Creating expense");

    const response = await fetch(`${API_URL}/despesas`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(expenseData)
    });

    const data = await response.json();

    if (!response.ok) {
      logger.warn({}, `ExpenseService: createExpense failed - ${data.message}`);
      throw new Error(data.message || "Error creating expense");
    }

    logger.info({}, "ExpenseService: Expense created successfully");

    return data.data;
  } catch (error) {
    logger.error({ error: error.message }, "ExpenseService: Error creating expense");
    throw error;
  }
}

/**
 * Update existing expense
 * 
 * @async
 * @param {string|number} id - Expense ID
 * @param {Object} expenseData - Updated expense data
 * @returns {Promise<Object>} Updated expense object
 * @throws {Error} If not authenticated, not found, or API error
 */
export async function updateExpense(id, expenseData) {
  const token = localStorage.getItem("token");

  try {
    if (!token) {
      logger.warn({}, "ExpenseService: Token not found");
      throw new Error("Token not found");
    }

    logger.debug({ id }, "ExpenseService: Updating expense");

    const response = await fetch(`${API_URL}/despesas/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(expenseData)
    });

    const data = await response.json();

    if (!response.ok) {
      logger.warn({ id }, `ExpenseService: updateExpense failed - ${data.message}`);
      throw new Error(data.message || "Error updating expense");
    }

    logger.info({ id }, "ExpenseService: Expense updated successfully");

    return data.data;
  } catch (error) {
    logger.error({ error: error.message }, "ExpenseService: Error updating expense");
    throw error;
  }
}

/**
 * Delete expense
 * 
 * @async
 * @param {string|number} id - Expense ID
 * @returns {Promise<void>}
 * @throws {Error} If not authenticated, not found, or API error
 */
export async function deleteExpense(id) {
  const token = localStorage.getItem("token");

  try {
    if (!token) {
      logger.warn({}, "ExpenseService: Token not found");
      throw new Error("Token not found");
    }

    logger.debug({ id }, "ExpenseService: Deleting expense");

    const response = await fetch(`${API_URL}/despesas/${id}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });

    const data = await response.json();

    if (!response.ok) {
      logger.warn({ id }, `ExpenseService: deleteExpense failed - ${data.message}`);
      throw new Error(data.message || "Error deleting expense");
    }

    logger.info({ id }, "ExpenseService: Expense deleted successfully");
  } catch (error) {
    logger.error({ error: error.message }, "ExpenseService: Error deleting expense");
    throw error;
  }
}
