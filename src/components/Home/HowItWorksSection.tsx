import { motion } from 'framer-motion';
import { Link, Send, CheckCircle } from 'lucide-react';

const steps = [
  {
    icon: Link,
    title: 'Conecte suas Contas',
    description: 'Conecte suas contas da plataforma desejada. O processo é simples e seguro.'
  },
  {
    icon: Send,
    title: 'Defina seus Comentários',
    description: 'Crie uma lista de comentários personalizados e relevantes que serão utilizados na automação.'
  },
  {
    icon: CheckCircle,
    title: 'Ative e Relaxe',
    description: 'Deixe o sistema trabalhar por você, gerando prova social automaticamente usando os perfis configurados.'
  }
];

export default function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-24 relative overflow-hidden bg-[#0F172A]">
      <div className="absolute inset-0 bg-gradient-to-t from-[#6366F1]/5 to-transparent" />
      <div className="container mx-auto px-4 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-[#0EA5E9] to-[#6366F1] bg-clip-text text-transparent">
            Como Funciona
          </h2>
          <p className="text-xl text-gray-400">
            Comece a automatizar seus comentários em 3 passos simples
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 relative">
          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-[#6366F1]/30 to-[#0EA5E9]/30 hidden md:block" />
          
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              className="relative"
            >
              <div className="bg-[#1E293B] p-8 rounded-2xl border border-[#6366F1]/30 hover:border-[#6366F1]/50 transition-all duration-300">
                <div className="bg-gradient-to-br from-[#0EA5E9] to-[#6366F1] w-12 h-12 rounded-xl flex items-center justify-center mb-6">
                  <step.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-4 text-white">{step.title}</h3>
                <p className="text-gray-400">{step.description}</p>
              </div>
              <div className="absolute -top-4 left-8 bg-[#0F172A] text-[#6366F1] px-3 py-1 rounded-full text-sm font-medium">
                Passo {index + 1}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}