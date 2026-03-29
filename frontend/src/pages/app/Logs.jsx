import { useNavigate } from "react-router-dom";
import LogViewer from "../../components/LogViewer";
import Navbar from "../../components/Navbar";
import Button from "../../components/Button";
import "../../styles/app.css";

/**
 * Logs Page
 * 
 * Developer/debugging page for viewing real-time frontend logs
 * Shows all application logs in a single view
 * 
 * Features:
 * - Real-time log display
 * - Filter by log level
 * - Export logs as CSV/JSON
 * - Clear log history
 * 
 * Access: /logs (internal development page)
 * 
 * @component
 */
export default function Logs() {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate("/dashboard");
  };

  return (
    <div className="app-layout">
      <Navbar onLogout={() => navigate("/login")} />
      
      <main className="app-content">
        <div className="app-container">
          {/* Page Header */}
          <div style={{ marginBottom: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h1 style={{ margin: 0, fontSize: '28px', fontWeight: 'bold' }}>
                Frontend Logs 📋
              </h1>
              <Button type="secondary" onClick={handleBack}>
                Back to Dashboard
              </Button>
            </div>
            <p style={{ color: '#666', margin: '0 0 8px 0' }}>
              Real-time debugging: View all frontend application logs, filter by level, or export for analysis.
            </p>
          </div>

          {/* Log Viewer */}
          <div style={{ background: '#fff', borderRadius: '8px', padding: '0' }}>
            <LogViewer maxHeight="600px" autoScroll={true} />
          </div>

          {/* Info */}
          <div style={{ marginTop: '16px', padding: '12px 16px', background: '#f0f4f8', borderRadius: '6px', fontSize: '12px', color: '#555', lineHeight: '1.5' }}>
            <strong>💡 Tips:</strong>
            <ul style={{ margin: '8px 0 0 20px', padding: 0 }}>
              <li>Logs are stored in memory (up to 500 recent entries)</li>
              <li>Filter by level to focus on specific types of events</li>
              <li>Export logs for analysis or share with team</li>
              <li>Open browser console (F12) to see styled logs</li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}
