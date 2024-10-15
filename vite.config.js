import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [
    laravel({
      input: ['resources/css/app.css', 'resources/js/app.tsx'],
      refresh: true,
    }),
    react(),
  ],
  resolve: {
    alias: {
      'react/jsx-runtime': 'react/jsx-runtime',
    },
  },
  build: {
    rollupOptions: {
      external: ['react', 'react-dom'],
    },
  },
});
