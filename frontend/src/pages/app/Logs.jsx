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
          <div style={{ marginBottom: '32px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '16px' }}>
              <div>
                <h1 style={{ margin: 0, fontSize: '32px', fontWeight: '700', color: '#0f172a' }}>
                  Frontend Logs 📋
                </h1>
              </div>
              <Button type="secondary" onClick={handleBack}>
                Back to Dashboard
              </Button>
            </div>
            <p style={{ color: '#64748b', margin: 0, fontSize: '15px', fontWeight: '400' }}>
              Real-time debugging: View all frontend application logs, filter by level, or export for analysis.
            </p>
          </div>

          {/* Log Viewer */}
          <div style={{ background: '#ffffff', borderRadius: '12px', padding: 0, border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(15, 23, 42, 0.06)' }}>
            <LogViewer maxHeight="600px" autoScroll={true} />
          </div>

          {/* Info */}
          <div style={{ marginTop: '20px', padding: '16px 20px', background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)', borderRadius: '10px', fontSize: '13px', color: '#0c4a6e', lineHeight: '1.6', border: '1px solid #7dd3fc' }}>
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
