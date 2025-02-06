import { motion } from 'framer-motion';

interface TabsProps {
  value: string;
  onValueChange: (value: string) => void;
  children: React.ReactNode;
  className?: string;
}

export function Tabs({ value, onValueChange, children, className = '' }: TabsProps) {
  return (
    <div className={className}>
      {children}
    </div>
  );
}

export function TabsList({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex space-x-2 mb-6">
      {children}
    </div>
  );
}

export function TabsTrigger({ value, children }: { value: string; children: React.ReactNode }) {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`
        px-6 py-3 rounded-lg font-medium transition-all duration-200
        ${value === 'instagram' ? 'bg-gradient-to-r from-purple-600 to-pink-600' :
          value === 'facebook' ? 'bg-gradient-to-r from-blue-600 to-blue-500' :
          'bg-gradient-to-r from-[#00f2ea] to-[#ff0050]'}
        hover:opacity-90 text-white
      `}
    >
      {children}
    </motion.button>
  );
}

export function TabsContent({ value, children }: { value: string; children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.2 }}
    >
      {children}
    </motion.div>
  );
}