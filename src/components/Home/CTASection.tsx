import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function CTASection() {
  return (
    <section className="py-24 relative overflow-hidden bg-[#0F172A]">
      <div className="absolute inset-0 bg-gradient-to-br from-[#0EA5E9] via-[#6366F1] to-[#A855F7] opacity-10" />
      <div className="container mx-auto px-4 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-[#0EA5E9] to-[#6366F1] bg-clip-text text-transparent">
            Pronto para Revolucionar seus Resultados?
          </h2>
          <p className="text-xl text-gray-400 mb-8">
            Junte-se a milhares de profissionais que já estão economizando tempo e aumentando seus resultados com a Commentify
          </p>
          <Link to="/login?signup=true">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-[#0EA5E9] to-[#6366F1] text-white px-8 py-4 rounded-xl text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Comece Agora Grátis
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}