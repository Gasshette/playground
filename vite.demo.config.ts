// vite.demo.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import { resolve } from 'path';

export default defineConfig({
  base: '/playground/',
  plugins: [react()],
  root: '.',
  build: {
    outDir: resolve(__dirname, 'build'),
    emptyOutDir: true
  }
});
