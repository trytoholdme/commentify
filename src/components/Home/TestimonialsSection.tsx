import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

const testimonials = [
  {
    name: "Carlos Silva",
    role: "Gestor de Tráfego",
    company: "Agência Digital",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&h=150",
    text: "A Commentify revolucionou nossa operação. Reduzimos o tempo gasto com comentários em 95% e aumentamos o ROI dos anúncios significativamente."
  },
  {
    name: "Ana Paula",
    role: "Social Media",
    company: "E-commerce",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&h=150",
    text: "Impressionante como conseguimos escalar nossos anúncios com prova social automatizada. O suporte é excepcional!"
  },
  {
    name: "Ricardo Mendes",
    role: "Marketing Manager",
    company: "Startup Tech",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&h=150",
    text: "A facilidade de uso e a velocidade dos comentários são incomparáveis. Melhor investimento que fizemos este ano."
  }
];

export default function TestimonialsSection() {
  return (
    <section id="testimonials" className="py-20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold mb-4">O que nossos clientes dizem</h2>
          <p className="text-xl text-gray-400">Histórias reais de sucesso com a Commentify</p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              className="bg-gray-800/50 p-6 rounded-2xl hover:bg-gray-800 transition-all duration-300"
            >
              <div className="flex items-center gap-1 text-yellow-400 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-current" />
                ))}
              </div>
              <p className="text-gray-300 mb-6">{testimonial.text}</p>
              <div className="flex items-center gap-4">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <div className="font-semibold">{testimonial.name}</div>
                  <div className="text-sm text-gray-400">
                    {testimonial.role} • {testimonial.company}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}