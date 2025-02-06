import { motion } from 'framer-motion';
import { Settings, Bell } from 'lucide-react';

interface DashboardHeaderProps {
  user: any;
}

export function DashboardHeader({ user }: DashboardHeaderProps) {
  return (
    <div className="flex justify-between items-center mb-8">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
      >
        <h1 className="text-3xl font-bold gradient-text">Dashboard</h1>
        <p className="text-gray-400">Bem-vindo de volta, {user?.name}</p>
      </motion.div>

      <div className="flex items-center gap-4">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors"
        >
          <Bell className="w-5 h-5 text-gray-400" />
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors"
        >
          <Settings className="w-5 h-5 text-gray-400" />
        </motion.button>
      </div>
    </div>
  );
}