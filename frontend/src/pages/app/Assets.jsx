import { useNavigate } from "react-router-dom";
import { FaWallet, FaBuilding, FaGem, FaShieldAlt, FaGift } from "react-icons/fa";
import { logout } from "../../services/authService";
import Button from "../../components/Button";
import Card from "../../components/Card";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import "../../styles/app.css";

/**
 * Assets Page
 * 
 * Displays user assets and property management
 * Part of the main 4-section dashboard
 * 
 * @component
 */
function Assets() {
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
              <h1 className="hero-title">Your Wealth <FaGift className="hero-icon" /></h1>
              <p className="hero-subtitle">
                Organize and protect your valuable assets with confidence
              </p>
            </div>
          </div>

          {/* Placeholder Content */}
          <div className="stats-section">
            <div className="section-header">
              <h2 className="section-title">Asset Portfolio 💎</h2>
              <p className="section-description">Track your valuable possessions and properties</p>
            </div>

            <div className="stats-grid">
              <div className="stat-card-wrapper">
                <Card className="stat-card">
                  <div className="stat-icon"><FaWallet /></div>
                  <p className="stat-label">Net Worth</p>
                  <p className="stat-value">$0.00</p>
                  <p className="stat-meta">Total asset value</p>
                </Card>
              </div>

              <div className="stat-card-wrapper">
                <Card className="stat-card">
                  <div className="stat-icon"><FaBuilding /></div>
                  <p className="stat-label">Real Estate</p>
                  <p className="stat-value">0</p>
                  <p className="stat-meta">Properties owned</p>
                </Card>
              </div>

              <div className="stat-card-wrapper">
                <Card className="stat-card">
                  <div className="stat-icon"><FaGem /></div>
                  <p className="stat-label">Collections</p>
                  <p className="stat-value">$0.00</p>
                  <p className="stat-meta">Collectibles value</p>
                </Card>
              </div>

              <div className="stat-card-wrapper">
                <Card className="stat-card">
                  <div className="stat-icon"><FaShieldAlt /></div>
                  <p className="stat-label">Protection</p>
                  <p className="stat-value">—</p>
                  <p className="stat-meta">Insurance status</p>
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

export default Assets;
