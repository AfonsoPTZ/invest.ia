import './style.css';

/**
 * Input reutilizável com label e error
 * Props:
 * - label: texto do label
 * - type: tipo do input (padrão: 'text')
 * - error: mensagem de erro
 * - value: valor do input
 * - onChange: função chamada ao mudar
 * - name: nome do input
 * - placeholder: placeholder
 */
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
