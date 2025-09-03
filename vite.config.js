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
        // Temporarily disabled anothearth to test build
        // 'experiences/anothearth/anothearth': resolve(__dirname, 'experiences/anothearth/anothearth.html'),
        'experiences/game-life/gameoflife': resolve(__dirname, 'experiences/game-life/gameoflife.html'),
        'experiences/maxkodiaplanet/maxkodiaplanet': resolve(__dirname, 'experiences/maxkodiaplanet/maxkodiaplanet.html'),
        'experiences/clean-squaredplace/cleansquaredplace': resolve(__dirname, 'experiences/clean-squaredplace/cleansquaredplace.html'),
        'experiences/space-words/spacewords': resolve(__dirname, 'experiences/space-words/spacewords.html'),
        'experiences/n-bases/nbases': resolve(__dirname, 'experiences/n-bases/nbases.html'),
        'experiences/human-thinker/humanthinker': resolve(__dirname, 'experiences/human-thinker/humanthinker.html'),
        'experiences/deepspace/deepspace': resolve(__dirname, 'experiences/deepspace/deepspace.html'),
        'experiences/thinker/thinker': resolve(__dirname, 'experiences/thinker/thinker.html')
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