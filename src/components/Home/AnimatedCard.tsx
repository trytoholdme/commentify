import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface AnimatedCardProps {
  children: ReactNode;
  delay?: number;
}

export default function AnimatedCard({ children, delay = 0 }: AnimatedCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ 
        duration: 0.6, 
        delay,
        type: "spring",
        stiffness: 100,
        damping: 20
      }}
      whileHover={{ 
        y: -5,
        transition: { duration: 0.2 }
      }}
      className="transform-gpu will-change-transform"
    >
      {children}
    </motion.div>
  );
}