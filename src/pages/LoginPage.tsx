import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MessageCircle, Loader } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const [searchParams] = useSearchParams();
  const isSignup = searchParams.get('signup') === 'true';
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: ''
  });
  const navigate = useNavigate();
  const { login, signup } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isSignup) {
        await signup(formData.email, formData.password, formData.name);
        toast.success('Conta criada com sucesso!');
      } else {
        await login(formData.email, formData.password);
        toast.success('Login realizado com sucesso!');
      }
      navigate('/dashboard');
    } catch (error) {
      toast.error('Erro ao processar sua solicitação');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full space-y-8 bg-gray-800/50 p-8 rounded-2xl"
      >
        <div>
          <div className="flex justify-center">
            <MessageCircle className="w-12 h-12 text-[#8B5CF6]" />
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
            {isSignup ? 'Crie sua conta' : 'Entre na sua conta'}
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            {isSignup && (
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-300">
                  Nome
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required={isSignup}
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="mt-1 block w-full rounded-lg bg-gray-700 border-gray-600 text-white focus:ring-[#8B5CF6] focus:border-[#8B5CF6]"
                />
              </div>
            )}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="mt-1 block w-full rounded-lg bg-gray-700 border-gray-600 text-white focus:ring-[#8B5CF6] focus:border-[#8B5CF6]"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                Senha
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete={isSignup ? 'new-password' : 'current-password'}
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="mt-1 block w-full rounded-lg bg-gray-700 border-gray-600 text-white focus:ring-[#8B5CF6] focus:border-[#8B5CF6]"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#8B5CF6] disabled:opacity-50"
            >
              {loading ? (
                <Loader className="w-5 h-5 animate-spin" />
              ) : (
                isSignup ? 'Criar Conta' : 'Entrar'
              )}
            </button>
          </div>

          <div className="text-center">
            <button
              type="button"
              onClick={() => navigate(`/login${!isSignup ? '?signup=true' : ''}`)}
              className="text-[#8B5CF6] hover:text-[#7C3AED] text-sm"
            >
              {isSignup
                ? 'Já tem uma conta? Entre aqui'
                : 'Não tem uma conta? Cadastre-se'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}