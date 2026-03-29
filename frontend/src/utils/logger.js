/**
 * Frontend Logger - Centralized logging with structured context
 * Same interface as backend logger, but uses console under the hood
 * Integrates with logStore for real-time log viewing in frontend
 * 
 * Usage:
 *   logger.info({ userId, email }, "User logged in");
 *   logger.warn({ email }, "Email not found");
 *   logger.error({ error: err.message }, "Request failed");
 * 
 * @module logger
 */

import { logStore } from "./logStore";

const LOG_LEVELS = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3
};

const COLORS = {
  debug: "#7B68EE",    // Medium Blue
  info: "#0066CC",     // Blue
  warn: "#FF8C00",     // Orange
  error: "#DC143C"     // Crimson
};

// Use import.meta.env for Vite (browser environment)
const LOG_LEVEL = import.meta.env.VITE_LOG_LEVEL || "info";
const CURRENT_LEVEL = LOG_LEVELS[LOG_LEVEL] || LOG_LEVELS.info;

/**
 * Format timestamp like backend: HH:MM:SS.mmm
 */
function getTimestamp() {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");
  const ms = String(now.getMilliseconds()).padStart(3, "0");
  return `${hours}:${minutes}:${seconds}.${ms}`;
}

/**
 * Format context object for display
 */
function formatContext(context) {
  if (!context || typeof context !== "object") {
    return "";
  }

  const entries = Object.entries(context)
    .map(([key, value]) => {
      if (value instanceof Error) {
        return `${key}: "${value.message}"`;
      }
      if (typeof value === "string") {
        return `${key}: "${value}"`;
      }
      return `${key}: ${JSON.stringify(value)}`;
    })
    .join(", ");

  return entries ? ` { ${entries} }` : "";
}

/**
 * Log formatter that matches backend output style
 */
function formatLog(level, context, message) {
  const timestamp = getTimestamp();
  const contextStr = formatContext(context);
  return `[${timestamp}] ${level.toUpperCase()}: ${message}${contextStr}`;
}

/**
 * Browser console style
 */
function getConsoleStyle(level) {
  const color = COLORS[level] || COLORS.info;
  return `color: white; background-color: ${color}; padding: 2px 6px; border-radius: 3px; font-weight: bold;`;
}

/**
 * Core logging function
 * Logs to console AND stores in log store for real-time viewing
 */
function log(level, context, message) {
  if (LOG_LEVELS[level] < CURRENT_LEVEL) {
    return;
  }

  const timestamp = getTimestamp();
  const formatted = formatLog(level, context, message);
  const consoleMethod = console[level] || console.log;

  // Style for badge
  const badgeStyle = getConsoleStyle(level);
  const messageStyle = "color: inherit; font-weight: normal;";

  try {
    if (typeof context === "object" && context !== null) {
      consoleMethod(`%c${level.toUpperCase()}%c ${message}`, badgeStyle, messageStyle, context);
    } else {
      consoleMethod(`%c${level.toUpperCase()}%c ${message}`, badgeStyle, messageStyle);
    }
  } catch (e) {
    // Fallback if browser console is not available
    consoleMethod(formatted);
  }

  // Store log in logStore for real-time viewing in frontend
  try {
    logStore.addLog({
      level,
      message,
      context: typeof context === "object" ? context : null,
      timestamp
    });
  } catch (e) {
    // Silently fail if logStore has issues
  }
}

/**
 * Logger API - Same as backend
 */
const logger = {
  /**
   * Debug level - Detailed technical information
   */
  debug: (context, message) => {
    log("debug", context, message);
  },

  /**
   * Info level - Normal events (login, registration, success)
   */
  info: (context, message) => {
    log("info", context, message);
  },

  /**
   * Warn level - Warnings (validation failed, not found)
   */
  warn: (context, message) => {
    log("warn", context, message);
  },

  /**
   * Error level - Errors (network, parsing, server)
   */
  error: (context, message) => {
    log("error", context, message);
  }
};

export default logger;
