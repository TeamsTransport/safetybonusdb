import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import tailwind from '@tailwindcss/vite';

export default defineConfig({
  plugins: [
    react(),
    tailwind(),
  ],
  server: {
    host: '0.0.0.0', // Bind to all interfaces
    port: 5173,
    strictPort: true, // Don't try other ports if 5173 is busy
    hmr: {
      clientPort: 5173, // Important for Docker
    },
    proxy: {
      '/api': {
        target: 'http://backend:5000', // Use Docker service name
        changeOrigin: true,
        secure: false,
      },
    },
    watch: {
      usePolling: true
    },
  },
});