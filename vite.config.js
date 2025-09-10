import { defineConfig } from 'vite';
import { resolve } from 'path';
import viteCompression from 'vite-plugin-compression';

export default defineConfig({
  base: '/',
  publicDir: 'public',
  optimizeDeps: {
    include: ['three', 'three/examples/jsm/controls/OrbitControls.js', 'three/examples/jsm/loaders/GLTFLoader.js'],
  },
  resolve: {
    alias: {
      '@config': resolve(__dirname, 'js/config'),
      '@managers': resolve(__dirname, 'js/managers'),
      '@ui': resolve(__dirname, 'js/ui'),
      '@assets': resolve(__dirname, 'public/assets'),
      '@experiences': resolve(__dirname, 'experiences'),}
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    emptyOutDir: true,
    assetsInlineLimit: 0, // Ensure all assets are copied as files
    commonjsOptions: {
      include: [/node_modules/],
      transformMixedEsModules: true,
    },
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        lifeGame: resolve(__dirname, 'experiences/LifeGame.html'),
        anothearth: resolve(__dirname, 'experiences/anothearth/anothearth.html'),
        canon: resolve(__dirname, 'experiences/canon/canon.html'),
        cleansquaredplace: resolve(__dirname, 'experiences/clean-squaredplace/cleansquaredplace.html'),
        deepspace: resolve(__dirname, 'experiences/deepspace/deepspace.html'),
        gameoflife: resolve(__dirname, 'experiences/game-life/gameoflife.html'),
        humanthinker: resolve(__dirname, 'experiences/human-thinker/humanthinker.html'),
        maxkodiaplanet: resolve(__dirname, 'experiences/maxkodiaplanet/maxkodiaplanet.html'),
        nbases: resolve(__dirname, 'experiences/n-bases/nbases.html'),
        nbasesCombo1: resolve(__dirname, 'experiences/n-bases/combo1/combo1.html'),
        spacewords: resolve(__dirname, 'experiences/space-words/spacewords.html'),
        thinker: resolve(__dirname, 'experiences/thinker/thinker.html'),
      },
      output: {
        assetFileNames: (assetInfo) => {
          const extType = assetInfo.name.split('.').at(1);
          if (extType === 'css') {
            return 'assets/css/[name]-[hash][extname]';
          }
          // Keep experience assets organized by experience name
          if (assetInfo.name.includes('experiences/')) {
            const expName = assetInfo.name.split('/')[1];
            return `assets/experiences/${expName}/[name]-[hash][extname]`;
          }
          return 'assets/[name]-[hash][extname]';
        },
        entryFileNames: (chunkInfo) => {
          // Keep entry points organized by experience
          if (chunkInfo.facadeModuleId && chunkInfo.facadeModuleId.includes('experiences/')) {
            const expName = chunkInfo.facadeModuleId.split('/')[1];
            return `assets/experiences/${expName}/[name]-[hash].js`;
          }
          return 'assets/js/[name]-[hash].js';
        },
        chunkFileNames: 'assets/js/[name]-[hash].js',
        manualChunks: (id) => {
          // Create separate vendor chunks for better caching
          if (id.includes('node_modules/three')) {
            return 'vendor_three';
          }
          if (id.includes('node_modules/')) {
            return 'vendor';
          }
          return null;
        }
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