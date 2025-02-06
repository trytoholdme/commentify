import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Send } from 'lucide-react';

export default function DemoSection() {
  return (
    <section id="demo" className="py-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-[#0F172A] to-gray-900" />
      <div className="container mx-auto px-4 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 gradient-text">
              Experimente Agora
            </h2>
            <p className="text-xl text-gray-400">
              Crie sua conta e ganhe 1 comentário grátis para testar
            </p>
          </div>

          <div className="gradient-border p-8 text-center">
            <h3 className="text-2xl font-bold mb-6 text-white">
              Teste Grátis
            </h3>
            <p className="text-gray-300 mb-8">
              Crie sua conta agora e ganhe 1 comentário grátis para testar nossa plataforma.
              Sem compromisso e sem necessidade de cartão de crédito.
            </p>
            
            <Link to="/login?signup=true">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="button-glow py-4 px-8 rounded-lg text-white font-medium flex items-center justify-center gap-2 mx-auto"
              >
                <Send className="w-5 h-5" />
                Criar Conta e Ganhar Teste Grátis
              </motion.button>
            </Link>

            <p className="text-sm text-gray-400 mt-6">
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}