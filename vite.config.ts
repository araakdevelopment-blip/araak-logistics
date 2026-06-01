import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/', // أعدها هكذا لتعمل على Vercel والدومين المباشر
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});