import { motion } from 'motion/react';
import Card from '../Card';

/**
 * Animated Card Component
 * 
 * Card with entrance animation and hover effects
 * Perfect for stat cards, content cards with visual feedback
 * 
 * Props:
 * - children: card content
 * - delay: animation delay in seconds (for staggered animations)
 * - onClick: optional click handler
 * - className: additional CSS classes
 */
export default function AnimatedCard({ 
  children, 
  delay = 0,
  onClick,
  className = '',
  ...props 
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.25,
        delay,
        ease: 'easeOut'
      }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    >
      <Card 
        className={className}
        interactive={!!onClick}
        {...props}
      >
        {children}
      </Card>
    </motion.div>
  );
}
