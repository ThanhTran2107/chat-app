import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  // Pre-bundle heavy ChatPage deps at dev server startup instead of discovering them
  // on first navigation to /chat, which otherwise forces a mid-session re-optimize + reload
  optimizeDeps: {
    include: ['antd', '@emoji-mart/react', 'emoji-mart', 'socket.io-client', 'howler', 'framer-motion'],
  },
  server: {
    proxy: {
      '/tetra': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id: string) {
          if (id.includes('node_modules')) {
            if (id.includes('antd')) return 'vendor_antd';
            if (id.includes('@emoji-mart')) return 'vendor_emoji';
            if (id.includes('socket.io-client')) return 'vendor_socketio';
            if (id.includes('react-router-dom')) return 'vendor_react_router';
            if (id.includes('react') || id.includes('react-dom')) return 'vendor_react';
            return 'vendor';
          }
        },
      },
    },
  },
});
