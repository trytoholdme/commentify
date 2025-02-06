import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, MessageCircle } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { motion } from 'framer-motion';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated, logout } = useAuth();
  const location = useLocation();

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Preços', href: '/#pricing' },
    { name: 'Como Funciona', href: '/#how-it-works' },
    { name: 'Depoimentos', href: '/#testimonials' },
  ];

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setIsOpen(false);

    if (location.pathname !== '/') {
      window.location.href = href;
      return;
    }

    const id = href.split('#')[1];
    if (!id) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    // Handle initial hash navigation
    const hash = window.location.hash;
    if (hash && location.pathname === '/') {
      setTimeout(() => {
        const element = document.getElementById(hash.slice(1));
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  }, [location.pathname]);

  return (
    <nav className="bg-gray-900/90 backdrop-blur-sm sticky top-0 z-50 border-b border-gray-800">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-3">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
              className="relative w-10 h-10 bg-gradient-to-br from-[#0EA5E9] to-[#6366F1] rounded-xl flex items-center justify-center"
            >
              <MessageCircle className="w-6 h-6 text-white" />
              <div className="absolute -inset-0.5 bg-gradient-to-br from-[#0EA5E9] to-[#6366F1] rounded-xl blur opacity-30 group-hover:opacity-100 transition duration-1000"></div>
            </motion.div>
            <motion.span
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-xl font-bold gradient-text"
            >
              Commentify
            </motion.span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <div className="flex items-center gap-6">
              {navigation.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item.href)}
                  className="text-gray-300 hover:text-white transition-colors hover-lift"
                >
                  {item.name}
                </a>
              ))}
            </div>
            <div className="flex items-center gap-4">
              {isAuthenticated ? (
                <>
                  <Link
                    to="/dashboard"
                    className="relative group px-4 py-2"
                  >
                    <span className="relative z-10 text-white bg-gradient-to-r from-[#0EA5E9] to-[#6366F1] px-4 py-2 rounded-lg inline-block">
                      Dashboard
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-[#0EA5E9] to-[#6366F1] rounded-lg blur opacity-50 group-hover:opacity-100 transition duration-300"></div>
                  </Link>
                  <button
                    onClick={logout}
                    className="text-gray-300 hover:text-white transition-colors hover-lift"
                  >
                    Sair
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="text-gray-300 hover:text-white transition-colors hover-lift"
                  >
                    Entrar
                  </Link>
                  <Link
                    to="/login?signup=true"
                    className="relative group px-4 py-2"
                  >
                    <span className="relative z-10 text-white bg-gradient-to-r from-[#0EA5E9] to-[#6366F1] px-4 py-2 rounded-lg inline-block">
                      Começar Grátis
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-[#0EA5E9] to-[#6366F1] rounded-lg blur opacity-50 group-hover:opacity-100 transition duration-300"></div>
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-gray-300 hover:text-white"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="md:hidden bg-gray-900 border-t border-gray-800"
        >
          <div className="container mx-auto px-4 py-4 space-y-4">
            {navigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                onClick={(e) => handleNavClick(e, item.href)}
                className="block text-gray-300 hover:text-white transition-colors"
              >
                {item.name}
              </a>
            ))}
            {isAuthenticated ? (
              <>
                <Link
                  to="/dashboard"
                  className="block text-white bg-gradient-to-r from-[#0EA5E9] to-[#6366F1] px-4 py-2 rounded-lg text-center"
                  onClick={() => setIsOpen(false)}
                >
                  Dashboard
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setIsOpen(false);
                  }}
                  className="block w-full text-left text-gray-300 hover:text-white transition-colors"
                >
                  Sair
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="block text-gray-300 hover:text-white transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  Entrar
                </Link>
                <Link
                  to="/login?signup=true"
                  className="block text-white bg-gradient-to-r from-[#0EA5E9] to-[#6366F1] px-4 py-2 rounded-lg text-center"
                  onClick={() => setIsOpen(false)}
                >
                  Começar Grátis
                </Link>
              </>
            )}
          </div>
        </motion.div>
      )}
    </nav>
  );
}