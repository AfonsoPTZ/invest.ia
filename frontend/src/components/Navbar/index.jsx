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
          <h1>Invest.IA</h1>
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
