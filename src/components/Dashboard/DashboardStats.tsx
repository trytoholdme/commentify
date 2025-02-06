import { motion } from 'framer-motion';
import { MessageCircle, TrendingUp, Clock, Target } from 'lucide-react';

export function DashboardStats() {
  const stats = [
    {
      icon: MessageCircle,
      label: 'Total de Comentários',
      value: '1,234',
      change: '+12.5%',
      positive: true
    },
    {
      icon: TrendingUp,
      label: 'Taxa de Sucesso',
      value: '98.2%',
      change: '+2.1%',
      positive: true
    },
    {
      icon: Clock,
      label: 'Tempo Médio',
      value: '1.2s',
      change: '-0.3s',
      positive: true
    },
    {
      icon: Target,
      label: 'Precisão',
      value: '99.9%',
      change: '+0.1%',
      positive: true
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="gradient-border p-6"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-[#0EA5E9] to-[#6366F1]">
              <stat.icon className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-400">{stat.label}</p>
              <p className="text-2xl font-bold text-white">{stat.value}</p>
            </div>
          </div>
          <div className={`text-sm ${stat.positive ? 'text-green-400' : 'text-red-400'}`}>
            {stat.change} em relação ao mês anterior
          </div>
        </motion.div>
      ))}
    </div>
  );
}