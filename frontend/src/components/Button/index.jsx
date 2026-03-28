import './style.css';

/**
 * Botão reutilizável
 * Props:
 * - type: 'primary' | 'secondary' | 'danger' (padrão: 'primary')
 * - onClick: função chamada ao clicar
 * - disabled: desabilita o botão
 * - children: texto do botão
 */
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
