import { motion } from 'framer-motion';
import { TrendingUp, Clock, Users, Target } from 'lucide-react';

const stats = [
  {
    icon: TrendingUp,
    value: '320%',
    label: 'Aumento médio no ROI',
    description: 'Nossos clientes relatam um aumento significativo no retorno sobre investimento.'
  },
  {
    icon: Clock,
    value: '95%',
    label: 'Economia de tempo',
    description: 'Reduza drasticamente o tempo gasto com gerenciamento de comentários.'
  },
  {
    icon: Users,
    value: '2.4k+',
    label: 'Clientes satisfeitos',
    description: 'Empresas e profissionais confiam na Commentify para automatizar seus comentários.'
  },
  {
    icon: Target,
    value: '1M+',
    label: 'Comentários concluídos',
    description: 'Milhões de comentários relevantes gerados com nossa tecnologia.'
  }
];

export default function StatsSection() {
  return (
    <section className="py-24 relative overflow-hidden bg-[#0F172A]">
      <div className="absolute inset-0 bg-gradient-to-br from-[#6366F1]/5 to-transparent" />
      <div className="container mx-auto px-4 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-[#0EA5E9] to-[#6366F1] bg-clip-text text-transparent">
            Números que Impressionam
          </h2>
          <p className="text-xl text-gray-400">
            Resultados reais que fazem a diferença no seu Business
          </p>
        </motion.div>

        <div className="grid md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-[#1E293B] p-6 rounded-2xl border border-[#6366F1]/30 hover:border-[#6366F1]/50 transition-all duration-300"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="bg-gradient-to-br from-[#0EA5E9] to-[#6366F1] p-3 rounded-xl">
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <div className="text-3xl font-bold text-white">{stat.value}</div>
              </div>
              <h3 className="text-lg font-semibold mb-2 text-white">{stat.label}</h3>
              <p className="text-gray-400">{stat.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}