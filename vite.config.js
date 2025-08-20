import { defineConfig } from 'vite';
import { resolve } from 'path';
import viteCompression from 'vite-plugin-compression';

export default defineConfig({
  base: './',
  publicDir: 'public',
  resolve: {
    alias: {
      '@config': resolve(__dirname, 'js/config'),
      '@managers': resolve(__dirname, 'js/managers'),
      '@ui': resolve(__dirname, 'js/ui'),
      '@assets': resolve(__dirname, 'public/assets')
    }
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        // Experiencias adicionales
        anothearth: resolve(__dirname, 'experiences/anothearth/anothearth.html'),
        maxkodia: resolve(__dirname, 'experiences/maxkodia/maxkodiaplanet.html'),
        gameoflife: resolve(__dirname, 'experiences/gameoflife/gameoflife.html'),
        cleansquaredplace: resolve(__dirname, 'experiences/cleansquaredplace/cleansquaredplace.html'),
        spacewords: resolve(__dirname, 'experiences/spacewords/spacewords.html'),
        nbases: resolve(__dirname, 'experiences/n-bases/nbases.html'),
        // 👉 agrega aquí más experiencias si lo necesitas
        // ejemplo:
        // otra: resolve(__dirname, 'experiences/OtraExperiencia/index.html')
      },
      output: {
        assetFileNames: (assetInfo) => {
          const extType = assetInfo.name.split('.').at(1);
          if (extType === 'css') {
            return 'assets/css/[name]-[hash][extname]';
          }
          return 'assets/[name]-[hash][extname]';
        },
        entryFileNames: 'assets/js/[name]-[hash].js',
        chunkFileNames: 'assets/js/[name]-[hash].js'
      }
    }
  },
  server: {
    port: 3000,
    open: true
  },
  plugins: [
    viteCompression({
      algorithm: 'brotliCompress',
      ext: '.br',
      threshold: 10240, // Comprime archivos mayores a 10KB
      deleteOriginFile: false
    }),
    viteCompression({
      algorithm: 'gzip',
      ext: '.gz',
      threshold: 10240,
      deleteOriginFile: false
    })
  ]
});