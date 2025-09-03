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
        'experiences/anothearth/anothearth': './experiences/anothearth/anothearth.html',
        'experiences/game-life/gameoflife': './experiences/game-life/gameoflife.html',
        'experiences/maxkodiaplanet/maxkodiaplanet': './experiences/maxkodiaplanet/maxkodiaplanet.html',
        'experiences/clean-squaredplace/cleansquaredplace': './experiences/clean-squaredplace/cleansquaredplace.html',
        'experiences/space-words/spacewords': './experiences/space-words/spacewords.html',
        'experiences/n-bases/nbases': './experiences/n-bases/nbases.html',
        'experiences/human-thinker/humanthinker': './experiences/human-thinker/humanthinker.html',
        'experiences/deepspace/deepspace': './experiences/deepspace/deepspace.html',
        'experiences/thinker/thinker': './experiences/thinker/thinker.html'
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