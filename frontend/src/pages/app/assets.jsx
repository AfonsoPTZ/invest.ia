import { useNavigate } from "react-router-dom";
import { FaWallet, FaBuilding, FaGem, FaLock, FaGift } from "react-icons/fa";
import { motion } from "motion/react";
import ICON_SIZES from "../../constants/iconSizes";
import { logout } from "../../services/authService";
import { useAuthUser } from "../../utils/useAuthUser";
import Button from "../../components/button";
import AnimatedCard from "../../components/animatedcard";
import Navbar from "../../components/navbar";
import Footer from "../../components/footer";
import PageTransition from "../../components/pagetransition";
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
  const { user } = useAuthUser();

  const handleLogoutClick = () => {
    logout();
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <PageTransition>
      <div className="app-layout">
        <Navbar userEmail={user?.email} onLogout={handleLogoutClick} />
        
        <main className="app-content">
          <div className="app-container">
            {/* Hero Section */}
            <motion.div 
              className="dashboard-hero"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
            >
              <div className="hero-content">
                <h1 className="hero-title">Your Wealth <FaGem size={ICON_SIZES.lg} className="hero-icon" /></h1>
                <p className="hero-subtitle text-center">
                  Organize and protect your valuable assets with confidence
                </p>
              </div>
            </motion.div>

            {/* Placeholder Content */}
            <motion.div 
              className="stats-section"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.25 }}
            >
            <div className="section-header">
              <h2 className="section-title">Asset Portfolio</h2>
              <p className="section-description">Track your valuable possessions and properties</p>
            </div>

              <div className="stats-grid">
                <AnimatedCard delay={0} className="stat-card">
                  <div className="stat-icon"><FaWallet size={ICON_SIZES.md} /></div>
                  <p className="stat-label">Net Worth</p>
                  <p className="stat-value">$0.00</p>
                  <p className="stat-meta">Total asset value</p>
                </AnimatedCard>

                <AnimatedCard delay={0.1} className="stat-card">
                  <div className="stat-icon"><FaBuilding size={ICON_SIZES.md} /></div>
                  <p className="stat-label">Real Estate</p>
                  <p className="stat-value">0</p>
                  <p className="stat-meta">Properties owned</p>
                </AnimatedCard>

                <AnimatedCard delay={0.2} className="stat-card">
                  <div className="stat-icon"><FaGem size={ICON_SIZES.md} /></div>
                  <p className="stat-label">Collections</p>
                  <p className="stat-value">$0.00</p>
                  <p className="stat-meta">Collectibles value</p>
                </AnimatedCard>

                <AnimatedCard delay={0.3} className="stat-card">
                  <div className="stat-icon"><FaLock size={ICON_SIZES.md} /></div>
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
