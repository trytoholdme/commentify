import { motion } from 'framer-motion';
import { Check, Zap, Shield, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';

const plans = [
  {
    name: 'Starter',
    icon: <Zap className="w-8 h-8 text-[#38BDF8]" />,
    price: 'R$ 97',
    period: '/mês',
    highlight: false,
    description: 'Perfeito para começar com automação',
    features: [
      'Instagram (Disponível)',
      'Facebook (Em Breve)',
      '100 comentários/dia',
      'API de comentários',
      'Dashboard básico',
      'Suporte por email',
      'Análise básica de métricas'
    ],
    checkoutUrl: 'https://payment.ticto.app/OA0B7FCAE'
  },
  {
    name: 'Pro',
    icon: <Shield className="w-8 h-8 text-[#EC4899]" />,
    price: 'R$ 197',
    period: '/mês',
    highlight: true,
    description: 'Ideal para escalar seus resultados',
    features: [
      'Instagram (Disponível)',
      'Facebook (Em Breve)',
      'TikTok (Em Breve)',
      '500 comentários/dia',
      'API de comentários premium',
      'Dashboard avançado',
      'Suporte prioritário',
      'Relatórios detalhados',
      'Automação avançada',
      'Métricas em tempo real'
    ],
    checkoutUrl: 'https://payment.ticto.app/O0E56DC72'
  },
  {
    name: 'TikTok',
    icon: <Globe className="w-8 h-8 text-[#8B5CF6]" />,
    price: 'R$ 147',
    period: '/mês',
    highlight: false,
    description: 'Exclusivo para TikTok',
    features: [
      'TikTok (Em Breve)',
      '300 comentários/dia',
      'API exclusiva TikTok',
      'Dashboard personalizado',
      'Suporte dedicado',
      'Métricas específicas',
      'Automação TikTok'
    ],
    checkoutUrl: 'https://payment.ticto.app/O640EBC81'
  }
];

export default function PricingSection() {
  return (
    <section id="pricing" className="py-24 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-900/50" />
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#8B5CF6] rounded-full blur-[128px] opacity-20" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-[#EC4899] rounded-full blur-[128px] opacity-20" />

      <div className="container mx-auto px-4 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-[#8B5CF6] via-[#EC4899] to-[#38BDF8] bg-clip-text text-transparent">
            Escolha o Plano Ideal
          </h2>
          <p className="text-xl text-gray-400">
            Escale seus resultados com nossa solução de automação de comentários
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className={`relative group ${
                plan.highlight
                  ? 'bg-gradient-to-b from-[#8B5CF6]/10 to-[#EC4899]/10'
                  : 'bg-gray-800/50'
              } rounded-2xl p-8 backdrop-blur-sm border border-gray-700/50 hover:border-gray-600/50 transition-all duration-300`}
            >
              {plan.highlight && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] text-white px-4 py-1 rounded-full text-sm font-medium">
                  Mais Popular
                </div>
              )}

              <div className="flex items-center gap-4 mb-6">
                <div className={`${
                  plan.highlight
                    ? 'bg-gradient-to-br from-[#8B5CF6] to-[#EC4899]'
                    : 'bg-gray-700'
                } p-3 rounded-xl`}>
                  {plan.icon}
                </div>
                <div>
                  <h3 className="text-xl font-bold">{plan.name}</h3>
                  <div className="text-gray-400 text-sm">
                    Automação Inteligente
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-gray-400">{plan.period}</span>
                </div>
                <p className="text-gray-400 mt-2">{plan.description}</p>
              </div>

              <div className="space-y-4 mb-8">
                {plan.features.map((feature) => (
                  <div key={feature} className="flex items-center gap-3">
                    <div className="flex-shrink-0">
                      <Check className="w-5 h-5 text-emerald-400" />
                    </div>
                    <span className={`text-gray-300 ${feature.includes('Em Breve') ? 'opacity-70' : ''}`}>
                      {feature}
                    </span>
                  </div>
                ))}
              </div>

              <a href={plan.checkoutUrl} target="_blank" rel="noopener noreferrer" className="block">
                <button className={`w-full py-4 px-6 rounded-xl font-semibold transition-all duration-300 ${
                  plan.highlight
                    ? 'bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] hover:opacity-90'
                    : 'bg-gray-700 hover:bg-gray-600'
                } text-white`}>
                  Assinar Agora
                </button>
              </a>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <h3 className="text-2xl font-bold mb-4">Precisa de mais?</h3>
          <a href="mailto:suporte@commentify.com" className="inline-flex items-center gap-2 text-[#8B5CF6] hover:text-[#7C3AED]">
            Entre em contato para um plano Enterprise personalizado
            <Check className="w-5 h-5" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}