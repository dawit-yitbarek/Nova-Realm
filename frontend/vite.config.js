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
    // Some shims need `global` defined
    global: 'globalThis',
  },
  plugins: [
    tailwindcss(),
    // Inject Node.js polyfills in both dev and build
    {
      ...rollupNodePolyFill(),
      enforce: 'post',
    },
  ],
  server: {
    host: '0.0.0.0', // Needed for local testing
  },
  preview: {
    allowedHosts: ['0.0.0.0'],
  },
  build: {
      outDir: 'dist',
      rollupOptions: {
        plugins: [
          // Also apply polyfills during the production build
          rollupNodePolyFill(),
        ],
      },
    },
});