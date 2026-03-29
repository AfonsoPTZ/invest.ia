import { useNavigate } from "react-router-dom";
import { FaTools } from "react-icons/fa";
import LogViewer from "../../components/LogViewer";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
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

  return (
    <div className="app-layout">
      <Navbar onLogout={() => navigate("/login")} />
      
      <main className="app-content">
        <div className="app-container">
          {/* Page Header */}
          <div className="dashboard-hero">
            <div className="hero-content">
              <h1 className="hero-title">System Diagnostics <FaTools className="hero-icon" /></h1>
              <p className="hero-subtitle">
                Real-time debugging: Monitor application performance and troubleshoot issues
              </p>
            </div>
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

          {/* Back Button */}
          <div style={{ marginTop: '40px' }}>
            <Button type="secondary" onClick={() => navigate('/dashboard')}>
              ← Back to Dashboard
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
