import { useNavigate } from "react-router-dom";
import { FaBriefcase, FaGift, FaChartBar, FaChartLine, FaRocket } from "react-icons/fa";
import { logout } from "../../services/authService";
import Button from "../../components/Button";
import Card from "../../components/Card";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import "../../styles/app.css";

/**
 * Income Page
 * 
 * Displays user income streams and management
 * Part of the main 4-section dashboard
 * 
 * @component
 */
function Income() {
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
              <h1 className="hero-title">Your Earnings <FaRocket className="hero-icon" /></h1>
              <p className="hero-subtitle">
                Track all your income streams and maximize your earning potential
              </p>
            </div>
          </div>

          {/* Placeholder Content */}
          <div className="stats-section">
            <div className="section-header">
              <h2 className="section-title">Income Streams 📊</h2>
              <p className="section-description">Overview of all your earning sources</p>
            </div>

            <div className="stats-grid">
              <div className="stat-card-wrapper">
                <Card className="stat-card">
                  <div className="stat-icon"><FaBriefcase /></div>
                  <p className="stat-label">Primary Income</p>
                  <p className="stat-value">$0.00</p>
                  <p className="stat-meta">Main job salary</p>
                </Card>
              </div>

              <div className="stat-card-wrapper">
                <Card className="stat-card">
                  <div className="stat-icon"><FaGift /></div>
                  <p className="stat-label">Bonuses & Rewards</p>
                  <p className="stat-value">$0.00</p>
                  <p className="stat-meta">Extra earnings</p>
                </Card>
              </div>

              <div className="stat-card-wrapper">
                <Card className="stat-card">
                  <div className="stat-icon"><FaChartBar /></div>
                  <p className="stat-label">Side Income</p>
                  <p className="stat-value">$0.00</p>
                  <p className="stat-meta">Secondary sources</p>
                </Card>
              </div>

              <div className="stat-card-wrapper">
                <Card className="stat-card">
                  <div className="stat-icon"><FaChartLine /></div>
                  <p className="stat-label">Total Monthly</p>
                  <p className="stat-value">$0.00</p>
                  <p className="stat-meta">All income combined</p>
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

export default Income;
