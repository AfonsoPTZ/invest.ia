import { useState, useEffect, useRef } from 'react';
import { logStore } from '../../utils/logStore';
import './style.css';

/**
 * LogViewer Component
 * 
 * Real-time log viewer for debugging frontend issues
 * Displays logs with filtering and export options
 * 
 * Props:
 * - maxHeight: CSS max-height (default: 500px)
 * - autoScroll: Auto-scroll to newest logs (default: true)
 * 
 * @component
 */
export default function LogViewer({ maxHeight = '500px', autoScroll = true }) {
  const [logs, setLogs] = useState([]);
  const [filter, setFilter] = useState('all'); // all, debug, info, warn, error
  const [stats, setStats] = useState({});
  const logsEndRef = useRef(null);

  /**
   * Subscribe to real-time log updates
   */
  useEffect(() => {
    // Get initial logs
    setLogs(logStore.getLogs());
    setStats(logStore.getStats());

    // Subscribe to updates
    const unsubscribe = logStore.subscribe((updatedLogs) => {
      setLogs(updatedLogs);
      setStats(logStore.getStats());
    });

    return unsubscribe;
  }, []);

  /**
   * Auto-scroll to bottom when new logs arrive
   */
  useEffect(() => {
    if (autoScroll && logsEndRef.current) {
      logsEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs, autoScroll]);

  /**
   * Filter logs by level
   */
  const filteredLogs = filter === 'all'
    ? logs
    : logs.filter(log => log.level === filter);

  /**
   * Clear all logs
   */
  const handleClear = () => {
    if (window.confirm('Clear all logs?')) {
      logStore.clear();
    }
  };

  /**
   * Export logs as CSV
   */
  const handleExportCSV = () => {
    const csv = logStore.exportCSV();
    downloadFile(csv, 'logs.csv', 'text/csv');
  };

  /**
   * Export logs as JSON
   */
  const handleExportJSON = () => {
    const json = logStore.exportJSON();
    downloadFile(json, 'logs.json', 'application/json');
  };

  /**
   * Helper: Download file
   */
  const downloadFile = (content, filename, type) => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  /**
   * Get color class for log level
   */
  const getLevelClass = (level) => {
    return `log-${level}`;
  };

  /**
   * Format context for display
   */
  const formatContext = (context) => {
    if (!context) return '';
    return JSON.stringify(context);
  };

  return (
    <div className="log-viewer-container">
      {/* Header with controls */}
      <div className="log-viewer-header">
        <h3>Frontend Logs</h3>
        
        <div className="log-viewer-controls">
          {/* Filter buttons */}
          <div className="log-filter">
            <button
              className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
              onClick={() => setFilter('all')}
              title={`All (${stats.total})`}
            >
              All ({stats.total})
            </button>
            <button
              className={`filter-btn ${filter === 'debug' ? 'active' : ''}`}
              onClick={() => setFilter('debug')}
              title={`Debug (${stats.debug})`}
            >
              Debug ({stats.debug})
            </button>
            <button
              className={`filter-btn ${filter === 'info' ? 'active' : ''}`}
              onClick={() => setFilter('info')}
              title={`Info (${stats.info})`}
            >
              Info ({stats.info})
            </button>
            <button
              className={`filter-btn ${filter === 'warn' ? 'active' : ''}`}
              onClick={() => setFilter('warn')}
              title={`Warn (${stats.warn})`}
            >
              Warn ({stats.warn})
            </button>
            <button
              className={`filter-btn ${filter === 'error' ? 'active' : ''}`}
              onClick={() => setFilter('error')}
              title={`Error (${stats.error})`}
            >
              Error ({stats.error})
            </button>
          </div>

          {/* Action buttons */}
          <div className="log-actions">
            <button
              className="action-btn export-csv"
              onClick={handleExportCSV}
              title="Export as CSV"
            >
              CSV
            </button>
            <button
              className="action-btn export-json"
              onClick={handleExportJSON}
              title="Export as JSON"
            >
              JSON
            </button>
            <button
              className="action-btn clear"
              onClick={handleClear}
              title="Clear all logs"
            >
              Clear
            </button>
          </div>
        </div>
      </div>

      {/* Logs display */}
      <div
        className="log-viewer-logs"
        style={{ maxHeight }}
      >
        {filteredLogs.length === 0 ? (
          <div className="log-empty">No logs to display</div>
        ) : (
          filteredLogs.map((log) => (
            <div
              key={log.id}
              className={`log-entry ${getLevelClass(log.level)}`}
              title={log.message}
            >
              <span className="log-timestamp">{log.timestamp}</span>
              <span className={`log-level log-level-${log.level}`}>
                {log.level.toUpperCase()}
              </span>
              <span className="log-message">{log.message}</span>
              {log.context && (
                <span className="log-context">
                  {formatContext(log.context)}
                </span>
              )}
            </div>
          ))
        )}
        <div ref={logsEndRef}></div>
      </div>

      {/* Footer with stats */}
      <div className="log-viewer-footer">
        <small>
          Displaying {filteredLogs.length} of {stats.total} logs
        </small>
      </div>
    </div>
  );
}
