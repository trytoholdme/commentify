import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  build: {
    target: 'esnext',
    minify: 'esbuild',
    cssMinify: true,
    modulePreload: {
      polyfill: false
    },
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor': ['react', 'react-dom'],
          'motion': ['framer-motion'],
          'router': ['react-router-dom'],
          'ui': ['lucide-react', 'react-hot-toast'],
          'store': ['zustand']
        }
      }
    }
  },
  server: {
    proxy: {
      '/instagram': {
        target: 'https://www.instagram.com',
        changeOrigin: true,
<<<<<<< HEAD
=======
        secure: false,
>>>>>>> 11807a8 (Atualização do projeto)
        rewrite: (path) => path.replace(/^\/instagram/, ''),
        configure: (proxy, _options) => {
          proxy.on('error', (err, _req, _res) => {
            console.log('proxy error', err);
          });
<<<<<<< HEAD
          proxy.on('proxyReq', (proxyReq, req, _res) => {
            const cookies = req.headers['x-instagram-cookies'];
            if (cookies) {
              proxyReq.setHeader('Cookie', cookies);
            }

            const relevantHeaders = [
              'user-agent',
              'origin',
              'referer',
=======

          proxy.on('proxyReq', (proxyReq, req, _res) => {
            // Remover headers problemáticos
            proxyReq.removeHeader('origin');
            proxyReq.removeHeader('referer');
            proxyReq.removeHeader('user-agent');
            proxyReq.removeHeader('x-instagram-cookies');

            // Adicionar headers necessários
            proxyReq.setHeader('host', 'www.instagram.com');
            proxyReq.setHeader('accept', 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8');
            proxyReq.setHeader('accept-language', 'en-US,en;q=0.9');
            proxyReq.setHeader('cache-control', 'no-cache');
            proxyReq.setHeader('pragma', 'no-cache');

            // Copiar cookies se existirem
            const cookies = req.headers['x-instagram-cookies'];
            if (cookies) {
              proxyReq.setHeader('cookie', cookies);
            }

            // Copiar outros headers relevantes
            const relevantHeaders = [
>>>>>>> 11807a8 (Atualização do projeto)
              'x-csrftoken',
              'x-instagram-ajax',
              'x-requested-with'
            ];

            relevantHeaders.forEach(header => {
              const value = req.headers[header];
              if (value) {
                proxyReq.setHeader(header, value);
              }
            });
          });
<<<<<<< HEAD
          proxy.on('proxyRes', (proxyRes, req, res) => {
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
            res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Instagram-Cookies, X-CSRFToken, X-Instagram-AJAX, X-Requested-With, Origin, Accept');
            res.setHeader('Access-Control-Allow-Credentials', 'true');
          });
        },
      },
    },
  },
=======

          proxy.on('proxyRes', (proxyRes, req, res) => {
            // Configurar CORS
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
            res.setHeader('Access-Control-Allow-Headers', '*');
            res.setHeader('Access-Control-Allow-Credentials', 'true');
            
            // Preservar cookies da resposta
            const cookies = proxyRes.headers['set-cookie'];
            if (cookies) {
              res.setHeader('set-cookie', cookies);
            }
          });
        }
      }
    }
  }
>>>>>>> 11807a8 (Atualização do projeto)
});