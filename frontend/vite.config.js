import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import rollupNodePolyFill from 'rollup-plugin-node-polyfills';

export default defineConfig({
  resolve: {
    alias: {
      buffer: 'buffer/',
    },
  },
  optimizeDeps: {
    include: ['buffer'],
  },
  define: {
    global: 'globalThis',
  },
  plugins: [
    tailwindcss(),
    {
      ...rollupNodePolyFill(),
      enforce: 'post',
    },
  ],
  server: {
    host: '0.0.0.0'
  },
  preview: {
    allowedHosts: ['0.0.0.0'],
  },
  build: {
    outDir: 'dist',
    rollupOptions: {
      plugins: [
        rollupNodePolyFill(),
      ],
    },
  },
});