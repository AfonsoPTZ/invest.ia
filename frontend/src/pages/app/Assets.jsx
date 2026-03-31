import { useNavigate } from "react-router-dom";
import { FaWallet, FaBuilding, FaGem, FaShieldAlt, FaGift } from "react-icons/fa";
import { motion } from "motion/react";
import { logout } from "../../services/authService";
import Button from "../../components/Button";
import AnimatedCard from "../../components/AnimatedCard";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import PageTransition from "../../components/PageTransition";
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
    <PageTransition>
      <div className="app-layout">
        <Navbar userEmail="user@example.com" onLogout={handleLogoutClick} />
        
        <main className="app-content">
          <div className="app-container">
            {/* Hero Section */}
            <motion.div 
              className="dashboard-hero"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="hero-content">
                <h1 className="hero-title">Your Wealth <FaGift className="hero-icon" /></h1>
                <p className="hero-subtitle">
                  Organize and protect your valuable assets with confidence
                </p>
              </div>
            </motion.div>

            {/* Placeholder Content */}
            <motion.div 
              className="stats-section"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
            <div className="section-header">
              <h2 className="section-title">Asset Portfolio 💎</h2>
              <p className="section-description">Track your valuable possessions and properties</p>
            </div>

              <div className="stats-grid">
                <AnimatedCard delay={0} className="stat-card">
                  <div className="stat-icon"><FaWallet /></div>
                  <p className="stat-label">Net Worth</p>
                  <p className="stat-value">$0.00</p>
                  <p className="stat-meta">Total asset value</p>
                </AnimatedCard>

                <AnimatedCard delay={0.1} className="stat-card">
                  <div className="stat-icon"><FaBuilding /></div>
                  <p className="stat-label">Real Estate</p>
                  <p className="stat-value">0</p>
                  <p className="stat-meta">Properties owned</p>
                </AnimatedCard>

                <AnimatedCard delay={0.2} className="stat-card">
                  <div className="stat-icon"><FaGem /></div>
                  <p className="stat-label">Collections</p>
                  <p className="stat-value">$0.00</p>
                  <p className="stat-meta">Collectibles value</p>
                </AnimatedCard>

                <AnimatedCard delay={0.3} className="stat-card">
                  <div className="stat-icon"><FaShieldAlt /></div>
                  <p className="stat-label">Protection</p>
                  <p className="stat-value">—</p>
                  <p className="stat-meta">Insurance status</p>
                </AnimatedCard>
              </div>
            </motion.div>

            {/* Back Button */}
            <motion.div 
              style={{ marginTop: '40px' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <Button type="secondary" onClick={() => navigate('/dashboard')}>
                ← Back to Dashboard
              </Button>
            </motion.div>
          </div>
        </main>

        <Footer />

        {/* Panda Mascot */}
        <motion.div 
          className="dashboard-panda-wrapper"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <img 
            src="/panda-investments-bottom.png" 
            alt="Invest_IA Mascot"
            className="dashboard-panda-image"
            onError={(e) => e.target.style.display = 'none'}
          />
        </motion.div>
      </div>
    </PageTransition>
  );
}

export default Assets;
