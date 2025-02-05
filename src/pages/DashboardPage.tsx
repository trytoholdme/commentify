import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import { Instagram, Facebook, MessageCircle, Cookie, Shield } from 'lucide-react';
import { InstagramDashboard } from '../components/Dashboard/InstagramDashboard';
import { FacebookDashboard } from '../components/Dashboard/FacebookDashboard';
import { TikTokDashboard } from '../components/Dashboard/TikTokDashboard';
import { UpgradePanel } from '../components/Dashboard/UpgradePanel';
import { TutorialSection } from '../components/Tutorial/TutorialSection';
import { SupportPanel } from '../components/Dashboard/SupportPanel';
import { UserManagement } from '../components/Admin/UserManagement';
import { useSubscription } from '../hooks/useSubscription';

export default function DashboardPage() {
  const { user } = useAuth();
  const { subscription, checkSubscription } = useSubscription();
  const [activePlatform, setActivePlatform] = useState<'instagram' | 'facebook' | 'tiktok' | 'tutorial' | 'admin'>('instagram');

  const isAdmin = user?.email === 'admin@commentify.com';

  // Verificar assinatura quando a página carrega
  useEffect(() => {
    checkSubscription();
  }, [checkSubscription]);

  // Verificar se o usuário tem um plano pago ativo
  const hasPaidPlan = subscription && subscription.status === 'active' && subscription.planType !== 'free';

  const platforms = [
    {
      id: 'instagram',
      name: 'Instagram',
      icon: Instagram,
      color: 'from-pink-500 to-purple-500'
    },
    {
      id: 'facebook',
      name: 'Facebook',
      icon: Facebook,
      color: 'from-blue-600 to-blue-500'
    },
    {
      id: 'tiktok',
      name: 'TikTok',
      icon: MessageCircle,
      color: 'from-[#00f2ea] to-[#ff0050]'
    },
    {
      id: 'tutorial',
      name: 'Tutorial Cookies',
      icon: Cookie,
      color: 'from-indigo-500 to-purple-500'
    },
    ...(isAdmin ? [{
      id: 'admin',
      name: 'Gerenciar Usuários',
      icon: Shield,
      color: 'from-indigo-600 to-indigo-400'
    }] : [])
  ];

  return (
    <div className="min-h-screen bg-[#0F172A] flex">
      {/* Sidebar */}
      <div className="w-64 bg-gray-800/50 border-r border-gray-700/50 p-4">
        <div className="mb-8">
          <h2 className="text-xl font-bold text-white mb-2">Dashboard</h2>
          <p className="text-gray-400 text-sm">Bem-vindo, {user?.name}</p>
          {subscription && (
            <div className="mt-2 text-sm">
              <span className="text-indigo-400">Plano: {subscription.planType.toUpperCase()}</span>
            </div>
          )}
        </div>
        
        <nav className="space-y-2">
          {platforms.map((platform) => (
            <button
              key={platform.id}
              onClick={() => setActivePlatform(platform.id as typeof activePlatform)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                activePlatform === platform.id
                  ? `bg-gradient-to-r ${platform.color} text-white`
                  : 'text-gray-400 hover:bg-gray-700/50'
              }`}
            >
              <platform.icon className="w-5 h-5" />
              <span>{platform.name}</span>
            </button>
          ))}
        </nav>

        {/* Support Panel in Sidebar */}
        <div className="mt-8">
          <SupportPanel />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        {/* Show upgrade panel only for free users who are not admin */}
        {!hasPaidPlan && !isAdmin && (
          <div className="mb-8">
            <UpgradePanel />
          </div>
        )}

        <motion.div
          key={activePlatform}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
        >
          {activePlatform === 'instagram' && <InstagramDashboard />}
          {activePlatform === 'facebook' && <FacebookDashboard />}
          {activePlatform === 'tiktok' && <TikTokDashboard />}
          {activePlatform === 'tutorial' && <TutorialSection />}
          {activePlatform === 'admin' && isAdmin && <UserManagement />}
        </motion.div>
      </div>
    </div>
  );
}