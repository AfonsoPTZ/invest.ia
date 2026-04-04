import { cn } from '../../lib/utils';
import { FaExclamationTriangle } from 'react-icons/fa';
import ICON_SIZES from '../../constants/iconSizes';
import './style.css';

/**
 * Input Component
 * 
 * Reusable input with label and error message
 * Supports different input types with consistent styling
 * 
 * Props:
 * - label: label text
 * - type: input type (default: 'text')
 * - error: error message (shows below input)
 * - value: input value
 * - onChange: function called on change
 * - name: input name
 * - placeholder: placeholder text
 * - disabled: disable input
 * - required: mark as required
 * - className: additional CSS classes
 */
export default function Input({ 
  label, 
  error, 
  disabled = false,
  required = false,
  className = '',
  onChange,
  ...props 
}) {
  // Clear error on user interaction (typing, deleting, etc)
  const handleChange = (e) => {
    if (onChange) {
      onChange(e);
    }
  };

  return (
    <div className="input-group">
      {label && (
        <label className={cn("input-label", required && "after:content-['*'] after:ml-1 after:text-red-500")}>
          {label}
        </label>
      )}
      <div className="input-wrapper">
        <input 
          className={cn(
            'input',
            error && 'has-error',
            disabled && 'opacity-50 cursor-not-allowed',
            className
          )} 
          disabled={disabled}
          aria-invalid={!!error}
          aria-describedby={error ? `${props.name}-error` : undefined}
          onChange={handleChange}
          {...props} 
        />
        {error && (
          <span className="input-error-icon" title={error}>
            <FaExclamationTriangle size={ICON_SIZES.sm} />
          </span>
        )}
      </div>
      {error && (
        <span 
          className="input-error"
          id={`${props.name}-error`}
          role="alert"
        >
          {error}
        </span>
      )}
    </div>
  );
}
