import { motion } from 'framer-motion';
import { Settings } from 'lucide-react';

interface AutomationPanelProps {
  platform: 'instagram' | 'facebook' | 'tiktok';
}

export function AutomationPanel({ platform }: AutomationPanelProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="gradient-border p-6"
    >
      <div className="flex items-center gap-3 mb-6">
        <Settings className="w-6 h-6 text-indigo-400" />
        <h2 className="text-xl font-bold text-white">Status da Automação</h2>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-400">Status</div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-400"></div>
            <span className="text-green-400">Ativo</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-400">Última Execução</div>
          <div className="text-white">-</div>
        </div>

        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-400">Próxima Execução</div>
          <div className="text-white">-</div>
        </div>

        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-400">Comentários Hoje</div>
          <div className="text-white">-</div>
        </div>
      </div>
    </motion.div>
  );
}