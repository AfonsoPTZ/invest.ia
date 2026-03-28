import './style.css';

/**
 * Card reutilizável
 * Props:
 * - children: conteúdo do card
 * - className: classes CSS adicionais
 */
export default function Card({ children, className = '', ...props }) {
  return (
    <div className={`card ${className}`} {...props}>
      {children}
    </div>
  );
}
