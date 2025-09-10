import { defineConfig } from 'vite';
import { resolve } from 'path';
import { globSync } from 'glob';
import viteCompression from 'vite-plugin-compression';

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
