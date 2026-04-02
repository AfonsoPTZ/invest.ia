import { cn } from '../../lib/utils';
import { CheckCircle2, CircleAlert, Info, TriangleAlert } from 'lucide-react';
import ICON_SIZES from '../../constants/iconSizes';
import './style.css';

/**
 * Alert Component
 * 
 * Inline alert message for displaying feedback
 * Used in forms and validation contexts
 * 
 * Note: For temporary notifications, use sonner toasts instead
 * This component is for persistent inline alerts
 * 
 * Props:
 * - type: 'error' | 'success' | 'info' | 'warning' (default: 'info')
 * - children: alert content
 * - onClose: optional function to close alert
 * - className: additional CSS classes
 */
export default function Alert({ 
  type = 'info', 
  children, 
  onClose,
  className = '', 
  ...props 
}) {
  const icons = {
    error: <CircleAlert size={ICON_SIZES.md} />,
    success: <CheckCircle2 size={ICON_SIZES.md} />,
    info: <Info size={ICON_SIZES.md} />,
    warning: <TriangleAlert size={ICON_SIZES.md} />
  };

  return (
    <div 
      className={cn(
        'alert',
        `alert-${type}`,
        className
      )}
      role={type === 'error' ? 'alert' : 'status'}
      {...props}
    >
      <span className="alert-icon" aria-hidden="true">
        {icons[type]}
      </span>
      <div className="alert-content">
        {children}
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="alert-close"
          aria-label="Close alert"
        >
          ×
        </button>
      )}
    </div>
  );
}
