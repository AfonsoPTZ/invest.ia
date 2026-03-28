import './style.css';

// Reusable card component
// Props:
// - children: card content
// - className: additional CSS classes
export default function Card({ children, className = '', ...props }) {
  return (
    <div className={`card ${className}`} {...props}>
      {children}
    </div>
  );
}
