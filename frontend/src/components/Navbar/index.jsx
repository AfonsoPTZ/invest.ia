import { useNavigate } from 'react-router-dom';
import './style.css';
import Button from '../Button';

// Navbar component for app pages
// Props:
// - userEmail: logged-in user email
// - onLogout: function called on logout
export default function Navbar({ userEmail, onLogout, className = '', ...props }) {
  const navigate = useNavigate();

  return (
    <nav className={`navbar ${className}`} {...props}>
      <div className="navbar-content">
        <div className="navbar-brand">
          {/* Panda Logo - Add panda-icon-navbar.png to public folder */}
          <img 
            src="/panda-icon-navbar.png"
            alt="Invest Panda I Logo"
            className="navbar-logo-image"
            onError={(e) => e.target.style.display = 'none'}
          />
          <h1>Invest Panda I</h1>
        </div>

        {/* Navigation Links */}
        <div className="navbar-links">
          <a className="navbar-link" onClick={() => navigate('/investments')}>Investments</a>
          <a className="navbar-link" onClick={() => navigate('/assets')}>Assets</a>
          <a className="navbar-link" onClick={() => navigate('/income')}>Income</a>
          <a className="navbar-link" onClick={() => navigate('/expense')}>Expense</a>
        </div>
        
        <div className="navbar-menu">
          {userEmail && <span className="navbar-email">{userEmail}</span>}
          <Button type="secondary" onClick={onLogout}>
            Sign Out
          </Button>
        </div>
      </div>
    </nav>
  );
}
