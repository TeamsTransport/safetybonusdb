import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    https: false,
    host: '0.0.0.0',
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://backend:5000',
        changeOrigin: true,
        secure: false,
      },
    },
    watch: {
      usePolling: true
    },
    appType: 'spa',
  },
});