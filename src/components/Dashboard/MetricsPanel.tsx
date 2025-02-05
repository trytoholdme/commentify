import { motion } from 'framer-motion';
import { BarChart, TrendingUp, Clock } from 'lucide-react';

interface MetricsPanelProps {
  platform: 'instagram' | 'facebook' | 'tiktok';
  stats: {
    total: number;
    success: number;
    failed: number;
  };
}

export function MetricsPanel({ platform, stats }: MetricsPanelProps) {
  const successRate = stats.total > 0 
    ? ((stats.success / stats.total) * 100).toFixed(1)
    : '0.0';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="gradient-border p-6"
    >
      <div className="flex items-center gap-3 mb-6">
        <BarChart className="w-6 h-6 text-indigo-400" />
        <h2 className="text-xl font-bold text-white">Métricas em Tempo Real</h2>
      </div>

      <div className="space-y-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-green-400" />
            <h3 className="text-sm font-medium text-gray-400">Taxa de Sucesso</h3>
          </div>
          <div className="text-2xl font-bold text-white">
            {successRate}%
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${successRate}%` }}
              className="bg-green-400 h-2 rounded-full"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-sm text-gray-400 mb-1">Total</div>
            <div className="text-2xl font-bold text-white">{stats.total}</div>
          </div>
          <div>
            <div className="text-sm text-gray-400 mb-1">Sucesso</div>
            <div className="text-2xl font-bold text-green-400">{stats.success}</div>
          </div>
          <div>
            <div className="text-sm text-gray-400 mb-1">Falhas</div>
            <div className="text-2xl font-bold text-red-400">{stats.failed}</div>
          </div>
          <div>
            <div className="text-sm text-gray-400 mb-1">Em Andamento</div>
            <div className="text-2xl font-bold text-yellow-400">
              {stats.total - (stats.success + stats.failed)}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}