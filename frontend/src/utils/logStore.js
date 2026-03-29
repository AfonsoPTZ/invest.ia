/**
 * Log Store - In-Memory Log Storage
 * 
 * Centralized storage for all frontend logs
 * Integrates with logger.js to capture logs in real-time
 * 
 * Features:
 * - Stores up to MAX_LOGS entries (memory efficient)
 * - FIFO removal when limit reached
 * - Listeners for real-time updates
 * - Simple filtering by level
 * 
 * Usage:
 *   logStore.addLog({ level, message, context, timestamp })
 *   logStore.getLogs() // Get all logs
 *   logStore.subscribe(callback) // Real-time updates
 */

const MAX_LOGS = 500; // Keep last 500 logs in memory

class LogStore {
  constructor() {
    this.logs = [];
    this.listeners = [];
  }

  /**
   * Add log entry to store
   * Called by logger when any log is produced
   * Keeps memory bounded by removing oldest logs
   */
  addLog(logEntry) {
    this.logs.push({
      ...logEntry,
      id: Date.now() + Math.random(), // Unique ID
      timestamp: logEntry.timestamp || new Date().toISOString()
    });

    // Keep only last MAX_LOGS
    if (this.logs.length > MAX_LOGS) {
      this.logs = this.logs.slice(-MAX_LOGS);
    }

    // Notify all listeners
    this.notifyListeners();
  }

  /**
   * Get all logs
   * @param {string} level - Optional: filter by level (debug, info, warn, error)
   * @returns {Array} Array of log entries
   */
  getLogs(level = null) {
    if (!level) {
      return [...this.logs];
    }
    return this.logs.filter(log => log.level === level);
  }

  /**
   * Get logs in reverse order (newest first)
   */
  getLogsReverse(level = null) {
    return this.getLogs(level).reverse();
  }

  /**
   * Clear all logs
   */
  clear() {
    this.logs = [];
    this.notifyListeners();
  }

  /**
   * Get log statistics
   */
  getStats() {
    const stats = {
      total: this.logs.length,
      debug: 0,
      info: 0,
      warn: 0,
      error: 0
    };

    this.logs.forEach(log => {
      if (log.level && stats[log.level] !== undefined) {
        stats[log.level]++;
      }
    });

    return stats;
  }

  /**
   * Subscribe to real-time updates
   * Callback is called whenever a log is added
   * @param {Function} callback - Called with updated logs array
   * @returns {Function} Unsubscribe function
   */
  subscribe(callback) {
    this.listeners.push(callback);
    
    // Return unsubscribe function
    return () => {
      this.listeners = this.listeners.filter(cb => cb !== callback);
    };
  }

  /**
   * Notify all listeners of updates
   */
  notifyListeners() {
    this.listeners.forEach(callback => {
      try {
        callback(this.logs);
      } catch (err) {
        console.error('Error in log store listener:', err);
      }
    });
  }

  /**
   * Export logs as CSV for analysis
   */
  exportCSV() {
    const headers = ['Timestamp', 'Level', 'Message', 'Context'];
    const rows = this.logs.map(log => [
      log.timestamp,
      log.level,
      log.message,
      JSON.stringify(log.context || {})
    ]);

    const csv = [headers, ...rows]
      .map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
      .join('\n');

    return csv;
  }

  /**
   * Export logs as JSON
   */
  exportJSON() {
    return JSON.stringify(this.logs, null, 2);
  }
}

// Singleton instance
export const logStore = new LogStore();

export default logStore;
