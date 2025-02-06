import { motion } from 'framer-motion';
import { Crown, Check } from 'lucide-react';
import { useSubscription } from '../../hooks/useSubscription';
import { useAuth } from '../../hooks/useAuth';
import toast from 'react-hot-toast';

export function UpgradePanel() {
  const { subscription } = useSubscription();
  const { user } = useAuth();

  const plans = [
    {
      name: 'Starter',
      price: 'R$ 97',
      features: [
        'Instagram (Disponível)',
        'Facebook (Em Breve)',
        '100 comentários/dia',
        'Dashboard básico',
        'Suporte por email'
      ],
      checkoutUrl: 'https://payment.ticto.app/OA0B7FCAE'
    },
    {
      name: 'Pro',
      price: 'R$ 197',
      features: [
        'Instagram (Disponível)',
        'Facebook (Em Breve)',
        'TikTok (Em Breve)',
        '500 comentários/dia',
        'Dashboard avançado',
        'Suporte prioritário',
        'Métricas em tempo real'
      ],
      checkoutUrl: 'https://payment.ticto.app/O0E56DC72'
    },
    {
      name: 'TikTok',
      price: 'R$ 147',
      features: [
        'TikTok (Em Breve)',
        '300 comentários/dia',
        'Dashboard personalizado',
        'Suporte dedicado'
      ],
      checkoutUrl: 'https://payment.ticto.app/O640EBC81'
    }
  ];

  // Não mostrar o painel se:
  // 1. O usuário for admin (admin@commentify.com)
  // 2. O usuário tiver um plano ativo (diferente de 'free')
  if (
    user?.email === 'admin@commentify.com' || 
    (subscription && subscription.planType !== 'free' && subscription.status === 'active')
  ) {
    return null;
  }

  return (
    <div className="gradient-border p-6">
      <div className="flex items-center gap-3 mb-6">
        <Crown className="w-6 h-6 text-yellow-500" />
        <h2 className="text-xl font-bold text-white">Upgrade seu Plano</h2>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        {plans.map((plan) => (
          <motion.div
            key={plan.name}
            whileHover={{ scale: 1.02 }}
            className="bg-gray-800 p-4 rounded-lg border border-gray-700"
          >
            <h3 className="text-lg font-semibold mb-2">{plan.name}</h3>
            <div className="text-2xl font-bold mb-4">{plan.price}<span className="text-sm text-gray-400">/mês</span></div>
            <ul className="space-y-2 mb-4">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-center gap-2 text-sm">
                  <Check className="w-4 h-4 text-green-500" />
                  <span className={feature.includes('Em Breve') ? 'opacity-70' : ''}>
                    {feature}
                  </span>
                </li>
              ))}
            </ul>
            <a 
              href={plan.checkoutUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-white font-medium text-center"
            >
              Assinar Agora
            </a>
          </motion.div>
        ))}
      </div>

      <p className="text-sm text-gray-400 mt-4 text-center">
        Precisa de um plano personalizado? <a href="mailto:suporte@commentify.com" className="text-indigo-400 hover:text-indigo-300">Entre em contato</a>
      </p>
    </div>
  );
}