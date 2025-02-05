import { motion } from 'framer-motion';
import { MessageCircle, ExternalLink } from 'lucide-react';

export function SupportPanel() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="gradient-border p-6"
    >
      <div className="flex items-center gap-3 mb-6">
        <MessageCircle className="w-6 h-6 text-green-500" />
        <h2 className="text-xl font-bold text-white">Suporte</h2>
      </div>

      <div className="text-center">
        <p className="text-gray-300 mb-4">
          Precisa de ajuda? Nossa equipe está pronta para te atender!
        </p>
        <a
          href="https://api.whatsapp.com/send?phone=5562991914513"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 rounded-lg text-white font-medium transition-colors"
        >
          <MessageCircle className="w-5 h-5" />
          Falar no WhatsApp
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>
    </motion.div>
  );
}