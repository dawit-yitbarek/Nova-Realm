// ✅ Tailwind CSS v4+ (ESM-compatible)
import tailwindcss from '@tailwindcss/postcss';
import autoprefixer from 'autoprefixer';

/** @type {import('postcss').Config} */
export default {
  plugins: [tailwindcss(), autoprefixer()],
};
