import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': '/src', // Caso você use o alias '@' para importar arquivos de dentro da pasta src
    },
  },
  server: {
    port: 5173, // O Vite vai rodar no porta 5173
  },
});
