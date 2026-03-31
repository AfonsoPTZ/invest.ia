import { useNavigate } from "react-router-dom";
import { FaBriefcase, FaChartLine, FaBullseye, FaBalanceScale, FaArrowUp } from "react-icons/fa";
import { motion } from "motion/react";
import { logout } from "../../services/authService";
import { useAuthUser } from "../../utils/useAuthUser";
import Button from "../../components/Button";
import AnimatedCard from "../../components/AnimatedCard";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import PageTransition from "../../components/PageTransition";
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
              transition={{ duration: 0.5 }}
            >
              <div className="hero-content">
                <h1 className="hero-title">
                  Growth Opportunities 
                  <motion.span
                    animate={{ y: [0, -8, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    style={{ display: 'inline-block', marginLeft: '8px' }}
                  >
                    <FaArrowUp className="hero-icon" />
                  </motion.span>
                </h1>
                <p className="hero-subtitle">
                  Explore and manage your investment portfolio with detailed insights
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
                <h2 className="section-title">Portfolio Analysis 📊</h2>
                <p className="section-description">Your investment performance at a glance</p>
              </div>

              <div className="stats-grid">
                <AnimatedCard delay={0} className="stat-card">
                  <div className="stat-icon"><FaBriefcase /></div>
                  <p className="stat-label">Portfolio Value</p>
                  <p className="stat-value">$0.00</p>
                  <p className="stat-meta">Total invested amount</p>
                </AnimatedCard>

                <AnimatedCard delay={0.1} className="stat-card">
                  <div className="stat-icon"><FaChartLine /></div>
                  <p className="stat-label">ROI Performance</p>
                  <p className="stat-value">0%</p>
                  <p className="stat-meta">Return on investment</p>
                </AnimatedCard>

                <AnimatedCard delay={0.2} className="stat-card">
                  <div className="stat-icon"><FaBullseye /></div>
                  <p className="stat-label">Active Positions</p>
                  <p className="stat-value">0</p>
                  <p className="stat-meta">Currently investing in</p>
                </AnimatedCard>

                <AnimatedCard delay={0.3} className="stat-card">
                  <div className="stat-icon"><FaBalanceScale /></div>
                  <p className="stat-label">Risk Profile</p>
                  <p className="stat-value">—</p>
                  <p className="stat-meta">Portfolio risk level</p>
                </AnimatedCard>
              </div>
            </motion.div>

            {/* Back Button */}
            <motion.div 
              style={{ marginTop: '40px' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
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

export default Investments;
