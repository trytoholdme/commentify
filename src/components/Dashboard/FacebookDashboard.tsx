import { Facebook } from 'lucide-react';
import { motion } from 'framer-motion';

export function FacebookDashboard() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <Facebook className="w-8 h-8 text-blue-500" />
        <h2 className="text-2xl font-bold text-white">Facebook</h2>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="gradient-border p-8 text-center"
      >
        <h3 className="text-2xl font-bold text-white mb-4">Em Breve</h3>
        <p className="text-gray-400">
          A automação para Facebook está em desenvolvimento e estará disponível em breve.
          Por enquanto, você pode usar nossa automação para Instagram e TikTok.
        </p>
      </motion.div>
    </div>
  );
}