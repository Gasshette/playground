import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path, { resolve } from 'path';
import dts from 'vite-plugin-dts';
import { libInjectCss } from 'vite-plugin-lib-inject-css';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    libInjectCss(),
    dts({
      include: ['lib', 'internals'],
      rollupTypes: true,
      tsconfigPath: 'tsconfig.build.json',
      outDir: 'dist'
    })
  ],
  build: {
    lib: {
      entry: resolve(__dirname, 'lib/index.ts'),
      name: 'Playground',
      // the proper extensions will be added
      fileName: 'index'
    },
    rollupOptions: {
      external: ['react', 'react/jsx-runtime']
    }
  },
  resolve: {
    alias: {
      '@lib': path.resolve(__dirname, 'lib'),
      '@int': path.resolve(__dirname, 'internals')
    }
  }
});
