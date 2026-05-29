import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  esbuild: {
    sourcemap: false
  },
  build: {
    sourcemap: false
  },
  optimizeDeps: {
    esbuildOptions: {
      sourcemap: false
    }
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:5001',
        changeOrigin: true
      }
    }
  }
});
