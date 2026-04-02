import { useNavigate } from 'react-router-dom';
import { Heart, MessageCircle, Mail } from 'lucide-react';
import ICON_SIZES from '../../constants/iconSizes';
import './style.css';

/**
 * Footer Component
 * 
 * Displays footer with branding, navigation links, and social icons
 * Elegant design with lucide-react icons for social media
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
      {/* Panda Icon - Top Left */}
      <img 
        src="src/assets/icons/panda-icon-navbar.png"
        alt="Invest Panda Logo"
        className="footer-panda-icon"
        style={{display: 'block'}}
      />
      <div className="footer-content">
        {/* Center Section - Navigation Links + Copyright */}
        <div className="footer-center">
          <nav className="footer-nav">
            <a className="footer-link" onClick={() => navigate('/dashboard')}>Home</a>
            <a className="footer-link" onClick={() => navigate('/investments')}>Investments</a>
            <a className="footer-link" onClick={() => navigate('/logs')}>Logs</a>
            <a className="footer-link" onClick={() => navigate('/dashboard')}>Dashboard</a>
          </nav>
          <div className="footer-bottom">
            <p className="footer-copyright">
              © 2026 <span className="footer-brand-name">Invest Panda IA</span>. All rights reserved.
            </p>
          </div>
        </div>

        {/* Contact Section - Right Column */}
        <div className="footer-contact">
          <div className="footer-contact-title">Contact The Creator</div>
          {/* Social Icons */}
          <div className="footer-socials">
            <a 
              href="https://instagram.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="social-icon social-icon-instagram" 
              title="Instagram"
              aria-label="Follow us on Instagram"
            >
              <Heart size={ICON_SIZES.md} />
            </a>
            <a 
              href="https://wa.me/1234567890" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="social-icon social-icon-whatsapp" 
              title="WhatsApp"
              aria-label="Chat with us on WhatsApp"
            >
              <MessageCircle size={ICON_SIZES.md} />
            </a>
            <a 
              href="mailto:contact@invest-ia.com" 
              className="social-icon" 
              title="Email"
              aria-label="Send us an email"
            >
              <Mail size={ICON_SIZES.md} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
