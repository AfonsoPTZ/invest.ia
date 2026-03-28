import './style.css';

// Reusable button component
// Props:
// - type: 'primary' | 'secondary' | 'danger' (default: 'primary')
// - onClick: function called on click
// - disabled: disable button
// - children: button text
export default function Button({ 
  type = 'primary', 
  onClick, 
  disabled = false, 
  children,
  className = '',
  ...props 
}) {
  return (
    <button 
      className={`btn btn-${type} ${className}`}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}
