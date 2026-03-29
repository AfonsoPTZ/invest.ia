import { useNavigate } from 'react-router-dom';
import { FaInstagram, FaWhatsapp, FaEnvelope } from 'react-icons/fa';
import './style.css';

/**
 * Footer Component
 * 
 * Displays footer with branding, navigation links, and social icons
 * Elegant design with react-icons integration for social media
 * 
 * Features:
 * - Navigation links (Home, Investments, Logs, Dashboard)
 * - Social media icons (Instagram, WhatsApp, Email)
 * - Footer copyright and attribution
 * 
 * @component
 */
export default function Footer() {
  const navigate = useNavigate();

  return (
    <footer className="footer">
      <div className="footer-content">
        {/* Brand/Logo */}
        <div className="footer-brand">
          <img 
            src="/src/assets/icons/panda-icon-navbar.png"
            alt="Invest Panda Logo"
            className="footer-brand-icon"
            onError={(e) => e.target.style.display = 'none'}
          />
        </div>

        {/* Navigation Links */}
        <nav className="footer-nav">
          <a className="footer-link" onClick={() => navigate('/dashboard')}>Home</a>
          <a className="footer-link" onClick={() => navigate('/investments')}>Investments</a>
          <a className="footer-link" onClick={() => navigate('/logs')}>Logs</a>
          <a className="footer-link" onClick={() => navigate('/dashboard')}>Dashboard</a>
        </nav>

        {/* Contact Section */}
        <div className="footer-contact">
          <div className="footer-contact-title">Contact the Creator</div>
          {/* Social Icons */}
          <div className="footer-socials">
            <a 
              href="https://instagram.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="social-icon" 
              title="Instagram"
              aria-label="Follow us on Instagram"
            >
              <FaInstagram />
            </a>
            <a 
              href="https://wa.me/1234567890" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="social-icon" 
              title="WhatsApp"
              aria-label="Chat with us on WhatsApp"
            >
              <FaWhatsapp />
            </a>
            <a 
              href="mailto:contact@invest-ia.com" 
              className="social-icon" 
              title="Email"
              aria-label="Send us an email"
            >
              <FaEnvelope />
            </a>
          </div>
        </div>

        {/* Copyright */}
        <div className="footer-bottom">
          <p className="footer-copyright">
            © 2026 <span className="footer-brand-name">Invest Panda IA</span>. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
