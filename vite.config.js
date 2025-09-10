import { defineConfig } from 'vite';
import { resolve } from 'path';
import { globSync } from 'glob';
import { fileURLToPath, URL } from 'url';
import viteCompression from 'vite-plugin-compression';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

// Dynamically generate the input object for Rollup
const input = Object.fromEntries(
  globSync(['./index.html', './experiences/**/*.html']).map(file => [
    // This will produce names like 'index', 'experiences-anothearth-anothearth', etc.
    file.slice(2, file.length - 5).replace(/[\/]/g, '-'),
    file
  ])
);

export default defineConfig({
  base: '/',
  publicDir: 'public',
  resolve: {
    alias: {
      '@config': resolve(__dirname, 'js/config'),
      '@managers': resolve(__dirname, 'js/managers'),
      '@ui': resolve(__dirname, 'js/ui'),
      '@assets': resolve(__dirname, 'public/assets'),
      '@experiences': resolve(__dirname, 'experiences'),
    }
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    emptyOutDir: true,
    rollupOptions: {
      input, // Use the dynamically generated input
      output: {
        assetFileNames: 'assets/[name]-[hash][extname]',
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
      }
    }
  },
  plugins: [
    viteCompression({ algorithm: 'brotliCompress', ext: '.br' }),
    viteCompression({ algorithm: 'gzip', ext: '.gz' })
  ]
});