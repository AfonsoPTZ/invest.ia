import './style.css';

/**
 * Alert reutilizável
 * Props:
 * - type: 'error', 'success', 'info', 'warning' (default: 'info')
 * - children: conteúdo do alert
 * - className: classes CSS adicionais
 */
export default function Alert({ type = 'info', children, className = '', ...props }) {
  return (
    <div className={`alert alert-${type} ${className}`} {...props}>
      {children}
    </div>
  );
}
