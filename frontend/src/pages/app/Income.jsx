import { useNavigate } from "react-router-dom";
import { Briefcase, Gift, BarChart3, TrendingUp, Rocket } from "lucide-react";
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
 * Income Page
 * 
 * Displays user income streams and management
 * Part of the main 4-section dashboard
 * 
 * @component
 */
function Income() {
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
                <h1 className="hero-title">Your Earnings <Rocket size={24} className="hero-icon" /></h1>
                <p className="hero-subtitle">
                  Track all your income streams and maximize your earning potential
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
              <h2 className="section-title">Income Streams 📊</h2>
              <p className="section-description">Overview of all your earning sources</p>
            </div>

              <div className="stats-grid">
                <AnimatedCard delay={0} className="stat-card">
                  <div className="stat-icon"><Briefcase size={20} /></div>
                  <p className="stat-label">Primary Income</p>
                  <p className="stat-value">$0.00</p>
                  <p className="stat-meta">Main job salary</p>
                </AnimatedCard>

                <AnimatedCard delay={0.1} className="stat-card">
                  <div className="stat-icon"><Gift size={20} /></div>
                  <p className="stat-label">Bonuses & Rewards</p>
                  <p className="stat-value">$0.00</p>
                  <p className="stat-meta">Extra earnings</p>
                </AnimatedCard>

                <AnimatedCard delay={0.2} className="stat-card">
                  <div className="stat-icon"><BarChart3 size={20} /></div>
                  <p className="stat-label">Side Income</p>
                  <p className="stat-value">$0.00</p>
                  <p className="stat-meta">Secondary sources</p>
                </AnimatedCard>

                <AnimatedCard delay={0.3} className="stat-card">
                  <div className="stat-icon"><TrendingUp size={20} /></div>
                  <p className="stat-label">Total Monthly</p>
                  <p className="stat-value">$0.00</p>
                  <p className="stat-meta">All income combined</p>
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

export default Income;
