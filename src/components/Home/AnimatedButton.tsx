import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface AnimatedButtonProps {
  children: ReactNode;
  primary?: boolean;
  onClick?: () => void;
}

export default function AnimatedButton({ children, primary = false, onClick }: AnimatedButtonProps) {
  return (
    <motion.button
      onClick={onClick}
      className={`
        relative px-8 py-4 rounded-xl font-semibold
        ${primary ? 'gradient-border text-white' : 'button-glow text-gray-300'}
        transition-all duration-300 ease-out
      `}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <span className="relative z-10">{children}</span>
      {primary && (
        <div className="absolute inset-0 bg-gradient-to-r from-[#0EA5E9] to-[#6366F1] opacity-10" />
      )}
    </motion.button>
  );
}