import './style.css';
import Button from '../Button';

// Navbar component for app pages
// Props:
// - userEmail: logged-in user email
// - onLogout: function called on logout
export default function Navbar({ userEmail, onLogout, className = '', ...props }) {
  return (
    <nav className={`navbar ${className}`} {...props}>
      <div className="navbar-content">
        <div className="navbar-brand">
          {/* Panda Logo - Add panda-icon-navbar.png to public folder */}
          <img 
            src="/panda-icon-navbar.png"
            alt="Invest_IA Logo"
            className="navbar-logo-image"
            onError={(e) => e.target.style.display = 'none'}
          />
          <h1>Invest_IA</h1>
        </div>
        
        <div className="navbar-menu">
          {userEmail && <span className="navbar-email">{userEmail}</span>}
          <Button type="secondary" onClick={onLogout}>
            Logout
          </Button>
        </div>
      </div>
    </nav>
  );
}
