import { motion, useReducedMotion } from 'framer-motion';
import { Zap, TrendingUp, Users, Clock, Shield, Target } from 'lucide-react';
import { Link } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import AnimatedTitle from '../components/Home/AnimatedTitle';
import AnimatedButton from '../components/Home/AnimatedButton';
import AnimatedCard from '../components/Home/AnimatedCard';
import ECGBackground from '../components/Home/ECGBackground';
import DemoSection from '../components/Home/DemoSection';

// Lazy loaded components
const PricingSection = lazy(() => import('../components/Home/PricingSection'));
const TestimonialsSection = lazy(() => import('../components/Home/TestimonialsSection'));
const FeaturesSection = lazy(() => import('../components/Home/FeaturesSection'));
const StatsSection = lazy(() => import('../components/Home/StatsSection'));
const HowItWorksSection = lazy(() => import('../components/Home/HowItWorksSection'));
const CTASection = lazy(() => import('../components/Home/CTASection'));

const LoadingFallback = () => (
  <div className="h-20 bg-gray-900 flex items-center justify-center">
    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
  </div>
);

const stats = [
  { icon: Clock, label: 'Economia de Tempo', value: '95%' },
  { icon: Target, label: 'Aumento no ROI', value: '3.2x' },
  { icon: Users, label: 'Clientes Satisfeitos', value: '2.4k+' }
] as const;

export default function HomePage() {
  const shouldReduceMotion = useReducedMotion();

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen">
      <section className="relative overflow-hidden py-20 sm:py-32">
        <div className="absolute inset-0 bg-[#0F172A]" />
        {!shouldReduceMotion && <ECGBackground />}
        <div className="container mx-auto px-4 relative">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full gradient-border mb-8"
            >
              <Zap className="w-4 h-4 text-[#6366F1]" />
              <span className="text-sm text-gray-300">Comentários em segundos</span>
            </motion.div>
            
            <AnimatedTitle text="Escale seus Anúncios com Prova Social Automática" />
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-xl md:text-2xl mb-8 text-gray-300"
            >
              Aumente seu ROI com comentários automáticos inteligentes
            </motion.p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-20">
              <Link to="/login?signup=true">
                <AnimatedButton primary>
                  Comece Agora Grátis
                </AnimatedButton>
              </Link>
              <a 
                href="#how-it-works"
                onClick={(e) => scrollToSection(e, 'how-it-works')}
              >
                <AnimatedButton>
                  Como Funciona
                </AnimatedButton>
              </a>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              {stats.map((stat, index) => (
                <AnimatedCard key={stat.label} delay={index * 0.1}>
                  <div className="gradient-border p-6">
                    <stat.icon className="w-8 h-8 text-[#6366F1] mb-4" />
                    <div className="text-3xl font-bold text-white mb-2">{stat.value}</div>
                    <div className="text-gray-400">{stat.label}</div>
                  </div>
                </AnimatedCard>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <Suspense fallback={<LoadingFallback />}>
        <FeaturesSection />
        <HowItWorksSection />
        <StatsSection />
        <PricingSection />
        <TestimonialsSection />
        <DemoSection />
        <CTASection />
      </Suspense>
    </div>
  );
}