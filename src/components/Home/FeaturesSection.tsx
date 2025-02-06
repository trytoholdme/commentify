import { motion } from 'framer-motion';
import { Zap, Shield, Target, Clock, BarChart, Users } from 'lucide-react';

const features = [
  {
    icon: Zap,
    title: 'Automação Instantânea',
    description: 'Comentários automáticos em segundos, sem atrasos ou complicações.'
  },
  {
    icon: Shield,
    title: 'Segurança Total',
    description: 'Sistema seguro e confiável, protegendo suas contas e dados.'
  },
  {
    icon: Target,
    title: 'Direcionamento Preciso',
    description: 'Comentários relevantes e personalizados para cada tipo de anúncio.'
  },
  {
    icon: Clock,
    title: 'Economia de Tempo',
    description: 'Automatize tarefas manuais e foque no que realmente importa.'
  },
  {
    icon: BarChart,
    title: 'Métricas Detalhadas',
    description: 'Acompanhe resultados e otimize sua estratégia em tempo real.'
  },
  {
    icon: Users,
    title: 'Escalabilidade',
    description: 'Cresça sem limites, mantendo a qualidade dos comentários.'
  }
];

export default function FeaturesSection() {
  return (
    <section className="py-24 relative overflow-hidden bg-[#0F172A]">
      <div className="absolute inset-0 bg-gradient-to-b from-[#6366F1]/5 to-transparent" />
      <div className="container mx-auto px-4 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-[#0EA5E9] to-[#6366F1] bg-clip-text text-transparent">
            Recursos Poderosos
          </h2>
          <p className="text-xl text-gray-400">
            Tudo que você precisa para automatizar e escalar seus resultados
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-[#1E293B] p-6 rounded-2xl border border-[#6366F1]/30 hover:border-[#6366F1]/50 transition-all duration-300"
            >
              <feature.icon className="w-10 h-10 text-[#6366F1] mb-4" />
              <h3 className="text-xl font-semibold mb-2 text-white">{feature.title}</h3>
              <p className="text-gray-400">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}