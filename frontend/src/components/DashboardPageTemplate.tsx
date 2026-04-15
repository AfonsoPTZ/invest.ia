import React from 'react';
import { motion } from 'motion/react';
import type { DashboardPageTemplateProps } from '../types/api';
import Button from './Button/index';
import AnimatedCard from './AnimatedCard/index';
import Navbar from './Navbar/index';
import Footer from './Footer/index';
import PageTransition from './PageTransition/index';
import { ANIMATION_HERO, ANIMATION_CONTENT, ANIMATION_ACTION, ANIMATION_FLOAT, ANIMATION_CARD_DELAYS } from '../constants/animations';
import '../styles/app.css';

/**
 * Dashboard Page Template Component (TypeScript)
 * 
 * Reusable template for dashboard pages (Investments, Assets, Income, Expense)
 * Eliminates code duplication across similar pages
 * 
 * Props: See DashboardPageTemplateProps interface
 * 
 * Usage:
 * 
 * function Investments() {
 *   const { user } = useAuthUser();
 *   const handleLogout = useLogout();
 *   const handleBack = () => navigate('/dashboard');
 *   
 *   const stats = [
 *     { id: '1', icon: <FaBriefcase />, label: 'Portfolio Value', value: '$0.00', meta: 'Total invested' },
 *     { id: '2', icon: <FaArrowUp />, label: 'ROI Performance', value: '0%', meta: 'Return on investment' }
 *   ];
 *   
 *   return (
 *     <DashboardPageTemplate
 *       title="Growth Opportunities"
 *       subtitle="Explore your investments"
 *       icon={<FaChartLine />}
 *       stats={stats}
 *       userEmail={user?.email}
 *       onLogout={handleLogout}
 *       onBackClick={handleBack}
 *     />
 *   );
 * }
 */
function DashboardPageTemplate({
  title,
  subtitle,
  icon,
  stats = [],
  userEmail,
  onLogout,
  onBackClick
}: DashboardPageTemplateProps): React.ReactElement {
  return (
    <PageTransition>
      <div className="app-layout">
        <Navbar userEmail={userEmail} onLogout={onLogout} />
        
        <main className="app-content">
          <div className="app-container">
            {/* Hero Section */}
            <motion.div 
              className="dashboard-hero"
              {...ANIMATION_HERO}
            >
              <div className="hero-content">
                <h1 className="hero-title">
                  {title}
                  <motion.span
                    style={{ display: 'inline-block', marginLeft: '8px' }}
                    {...ANIMATION_FLOAT}
                  >
                    {icon}
                  </motion.span>
                </h1>
                <p className="hero-subtitle text-center">
                  {subtitle}
                </p>
              </div>
            </motion.div>

            {/* Statistics Section */}
            <motion.div 
              className="stats-section"
              {...ANIMATION_CONTENT}
            >
              <div className="section-header">
                <h2 className="section-title">Overview</h2>
                <p className="section-description">Your performance at a glance</p>
              </div>

              {stats.length > 0 && (
                <div className="stats-grid">
                  {stats.map((stat, index) => (
                    <AnimatedCard 
                      key={stat.id || index}
                      delay={ANIMATION_CARD_DELAYS[index] || 0} 
                      className="stat-card"
                    >
                      <div className="stat-icon">{stat.icon}</div>
                      <p className="stat-label">{stat.label}</p>
                      <p className="stat-value">{stat.value}</p>
                      <p className="stat-meta">{stat.trend || ''}</p>
                    </AnimatedCard>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Back to Dashboard Button */}
            <motion.div 
              style={{ marginTop: '40px' }}
              {...ANIMATION_ACTION(0.3)}
            >
              <Button type="secondary" onClick={onBackClick}>
                ← Back to Dashboard
              </Button>
            </motion.div>
          </div>
        </main>

        <Footer />
      </div>
    </PageTransition>
  );
}

export default DashboardPageTemplate;
