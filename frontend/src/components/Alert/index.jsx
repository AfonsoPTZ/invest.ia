import './style.css';

// Reusable alert component
// Props:
// - type: 'error', 'success', 'info', 'warning' (default: 'info')
// - children: alert content
// - className: additional CSS classes
export default function Alert({ type = 'info', children, className = '', ...props }) {
  return (
    <div className={`alert alert-${type} ${className}`} {...props}>
      {children}
    </div>
  );
}
