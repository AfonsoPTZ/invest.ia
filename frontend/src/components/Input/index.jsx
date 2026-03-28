import './style.css';

// Reusable input component with label and error message
// Props:
// - label: label text
// - type: input type (default: 'text')
// - error: error message
// - value: input value
// - onChange: function called on change
// - name: input name
// - placeholder: placeholder text
export default function Input({ 
  label, 
  error, 
  className = '',
  ...props 
}) {
  return (
    <div className="input-group">
      {label && <label>{label}</label>}
      <input className={`input ${className}`} {...props} />
      {error && <span className="error">{error}</span>}
    </div>
  );
}
