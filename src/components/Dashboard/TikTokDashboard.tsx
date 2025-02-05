import { BookText as TikTok } from 'lucide-react';
import { motion } from 'framer-motion';

export function TikTokDashboard() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <TikTok className="w-8 h-8 text-[#00f2ea]" />
        <h2 className="text-2xl font-bold text-white">TikTok</h2>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="gradient-border p-8 text-center"
      >
        <h3 className="text-2xl font-bold text-white mb-4">Em Breve</h3>
        <p className="text-gray-400">
          A automação para TikTok está em desenvolvimento e estará disponível em breve.
          Por enquanto, você pode usar nossa automação para Instagram.
        </p>
      </motion.div>
    </div>
  );
}