import { cn } from '../../lib/utils';
import './style.css';

/**
 * Button Component
 * 
 * Reusable button with multiple style variants
 * 
 * Props:
 * - type: 'primary' | 'secondary' | 'danger' (default: 'primary')
 * - size: 'sm' | 'md' | 'lg' (default: 'md')
 * - onClick: function called on click
 * - disabled: disable button
 * - isLoading: show loading state
 * - children: button text/content
 * - className: additional CSS classes
 */
export default function Button({ 
  type = 'primary', 
  size = 'md',
  onClick, 
  disabled = false,
  isLoading = false,
  children,
  className = '',
  ...props 
}) {
  const sizeClasses = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-5 py-2.5 text-base',
    lg: 'px-6 py-3 text-lg'
  };

  return (
    <button 
      className={cn(
        'btn',
        `btn-${type}`,
        sizeClasses[size],
        isLoading && 'opacity-70 cursor-not-allowed',
        className
      )}
      onClick={onClick}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="flex items-center gap-2">
          <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></span>
          {children}
        </span>
      ) : (
        children
      )}
    </button>
  );
}
