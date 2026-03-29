import { useNavigate } from "react-router-dom";
import { FaBriefcase, FaChartLine, FaBullseye, FaBalanceScale, FaArrowUp } from "react-icons/fa";
import { logout } from "../../services/authService";
import Button from "../../components/Button";
import Card from "../../components/Card";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import "../../styles/app.css";

/**
 * Investments Page
 * 
 * Displays user investment portfolio and management tools
 * Part of the main 4-section dashboard
 * 
 * @component
 */
function Investments() {
  const navigate = useNavigate();

  const handleLogoutClick = () => {
    logout();
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="app-layout">
      <Navbar userEmail="user@example.com" onLogout={handleLogoutClick} />
      
      <main className="app-content">
        <div className="app-container">
          {/* Hero Section */}
          <div className="dashboard-hero">
            <div className="hero-content">
              <h1 className="hero-title">Growth Opportunities <FaArrowUp className="hero-icon" /></h1>
              <p className="hero-subtitle">
                Explore and manage your investment portfolio with detailed insights
              </p>
            </div>
          </div>

          {/* Placeholder Content */}
          <div className="stats-section">
            <div className="section-header">
              <h2 className="section-title">Portfolio Analysis 📊</h2>
              <p className="section-description">Your investment performance at a glance</p>
            </div>

            <div className="stats-grid">
              <div className="stat-card-wrapper">
                <Card className="stat-card">
                  <div className="stat-icon"><FaBriefcase /></div>
                  <p className="stat-label">Portfolio Value</p>
                  <p className="stat-value">$0.00</p>
                  <p className="stat-meta">Total invested amount</p>
                </Card>
              </div>

              <div className="stat-card-wrapper">
                <Card className="stat-card">
                  <div className="stat-icon"><FaChartLine /></div>
                  <p className="stat-label">ROI Performance</p>
                  <p className="stat-value">0%</p>
                  <p className="stat-meta">Return on investment</p>
                </Card>
              </div>

              <div className="stat-card-wrapper">
                <Card className="stat-card">
                  <div className="stat-icon"><FaBullseye /></div>
                  <p className="stat-label">Active Positions</p>
                  <p className="stat-value">0</p>
                  <p className="stat-meta">Currently investing in</p>
                </Card>
              </div>

              <div className="stat-card-wrapper">
                <Card className="stat-card">
                  <div className="stat-icon"><FaBalanceScale /></div>
                  <p className="stat-label">Risk Profile</p>
                  <p className="stat-value">—</p>
                  <p className="stat-meta">Portfolio risk level</p>
                </Card>
              </div>
            </div>
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

      {/* Panda Mascot */}
      <div className="dashboard-panda-wrapper">
        <img 
          src="/panda-investments-bottom.png" 
          alt="Invest_IA Mascot"
          className="dashboard-panda-image"
          onError={(e) => e.target.style.display = 'none'}
        />
      </div>
    </div>
  );
}

export default Investments;
