import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  root: '.',
  publicDir: 'public',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        // Agrega aquí otras páginas de entrada si es necesario
        // por ejemplo: other: resolve(__dirname, 'other-page.html')
      }
    }
  },
  server: {
    port: 3000,
    open: true
  }
});
