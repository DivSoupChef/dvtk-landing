import path from 'path';

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import viteConvertImages from 'vite-convert-images';
import createSvgSpritePlugin from 'vite-plugin-svg-sprite';

export default defineConfig({
  resolve: {
    alias: {
      '@styles': path.resolve(__dirname, 'src/styles'),
    },
  },

  css: {
    preprocessorOptions: {
      scss: {
        additionalData: '@use "sass:math";',
      },
    },
  },

  plugins: [
    react(),
    viteConvertImages({
      assetsDir: 'src/assets/images/',
    }),
    createSvgSpritePlugin({
      exportType: 'react',
      include: '**/icons/*.svg',
    }),
  ],

  base: '/dvtk-landing/',
  build: {
    outDir: 'docs',
    rollupOptions: {
      output: {
        assetFileNames: 'assets/[name]-[hash][extname]',
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
      },
    },
    target: 'es2015',
    minify: 'terser',
    cssCodeSplit: true,
  },
  server: {
    hmr: true,
  },
});
