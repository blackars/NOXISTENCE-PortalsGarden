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
        main: './index.html',
        // Experiencias adicionales
        anothearth: './experiences/anothearth/anothearth.html',
        gameoflife: './experiences/game-life/gameoflife.html',
        maxkodiaplanet: './experiences/maxkodiaplanet/maxkodiaplanet.html',
        cleansquaredplace: './experiences/clean-squaredplace/cleansquaredplace.html',
        spacewords: './experiences/space-words/spacewords.html',
        nbases: './experiences/n-bases/nbases.html',
        humanthinker: './experiences/human-thinker/humanthinker.html',
        deepspace: './experiences/deepspace/deepspace.html',
        thinker: './experiences/thinker/thinker.html',

        // 👉 agrega aquí más experiencias si lo necesitas
        // ejemplo:
        // otra: './experiences/OtraExperiencia/index.html'
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