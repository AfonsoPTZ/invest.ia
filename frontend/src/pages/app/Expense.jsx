import { useNavigate } from "react-router-dom";
import { FaShoppingCart, FaCar, FaUtensils, FaMoneyBillWave, FaBullseye } from "react-icons/fa";
import { logout } from "../../services/authService";
import Button from "../../components/Button";
import Card from "../../components/Card";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import "../../styles/app.css";

/**
 * Expense Page
 * 
 * Displays user expenses tracking and management
 * Part of the main 4-section dashboard
 * 
 * @component
 */
function Expense() {
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
              <h1 className="hero-title">Smart Spending <FaBullseye className="hero-icon" /></h1>
              <p className="hero-subtitle">
                Monitor your spending and optimize your budget for better financial health
              </p>
            </div>
          </div>

          {/* Placeholder Content */}
          <div className="stats-section">
            <div className="section-header">
              <h2 className="section-title">Expense Breakdown 📉</h2>
              <p className="section-description">Analyze your spending by category</p>
            </div>

            <div className="stats-grid">
              <div className="stat-card-wrapper">
                <Card className="stat-card">
                  <div className="stat-icon"><FaShoppingCart /></div>
                  <p className="stat-label">Retail</p>
                  <p className="stat-value">$0.00</p>
                  <p className="stat-meta">Shopping expenses</p>
                </Card>
              </div>

              <div className="stat-card-wrapper">
                <Card className="stat-card">
                  <div className="stat-icon"><FaCar /></div>
                  <p className="stat-label">Transportation</p>
                  <p className="stat-value">$0.00</p>
                  <p className="stat-meta">Travel expenses</p>
                </Card>
              </div>

              <div className="stat-card-wrapper">
                <Card className="stat-card">
                  <div className="stat-icon"><FaUtensils /></div>
                  <p className="stat-label">Dining & Food</p>
                  <p className="stat-value">$0.00</p>
                  <p className="stat-meta">Food & restaurants</p>
                </Card>
              </div>

              <div className="stat-card-wrapper">
                <Card className="stat-card">
                  <div className="stat-icon"><FaMoneyBillWave /></div>
                  <p className="stat-label">Total Monthly</p>
                  <p className="stat-value">$0.00</p>
                  <p className="stat-meta">All expenses combined</p>
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

export default Expense;
