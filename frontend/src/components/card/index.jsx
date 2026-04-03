import { cn } from '../../lib/utils';
import './style.css';

/**
 * Card Component
 * 
 * Reusable card container for content grouping
 * Supports different visual styles
 * 
 * Props:
 * - children: card content
 * - variant: 'default' | 'elevated' | 'outlined' (default: 'default')
 * - className: additional CSS classes
 * - interactive: add hover effects (default: false)
 */
export default function Card({ 
  children, 
  variant = 'default',
  interactive = false,
  className = '', 
  ...props 
}) {
  const variantClasses = {
    default: 'card',
    elevated: 'card shadow-lg',
    outlined: 'card border-2'
  };

  return (
    <div 
      className={cn(
        variantClasses[variant],
        interactive && 'transition-all duration-300 hover:shadow-xl hover:border-accent-500',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
