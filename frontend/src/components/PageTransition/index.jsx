import { motion } from 'motion/react';

/**
 * Page Transition Wrapper
 * 
 * Provides consistent entrance animation for pages
 * Fades in with slight slide up movement
 * 
 * Usage:
 * <PageTransition>
 *   <YourPageContent />
 * </PageTransition>
 */
export default function PageTransition({ children, className = '' }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{
        duration: 0.25,
        ease: 'easeOut'
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
