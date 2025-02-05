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
        rewrite: (path) => path.replace(/^\/instagram/, ''),
        configure: (proxy, _options) => {
          proxy.on('error', (err, _req, _res) => {
            console.log('proxy error', err);
          });
          proxy.on('proxyReq', (proxyReq, req, _res) => {
            const cookies = req.headers['x-instagram-cookies'];
            if (cookies) {
              proxyReq.setHeader('Cookie', cookies);
            }

            const relevantHeaders = [
              'user-agent',
              'origin',
              'referer',
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
});