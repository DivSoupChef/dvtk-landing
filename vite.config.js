import { defineConfig } from 'vite';
import fs from 'fs';
import path from 'path';

import picturePlugin from './plugins/vite-picture-plugin.js';
import buildPagesFix from './plugins/vite-build-pages-fix.js';
import htmlMinifyPlugin from './plugins/vite-html-minify.js';
import viteSvgPlugin from './plugins/vite-svg-plugin.js';
import htmlIconsPlugin from './plugins/vite-html-icons.js';
import htmlTemplatePlugin from './plugins/html-template/index.js';
import htmlAssetsOrderPlugin from './plugins/vite-html-assets-order.js';

function getHtmlInputs() {
  const pagesDir = path.resolve('src/pages');
  const inputs = {};

  fs.readdirSync(pagesDir).forEach(file => {
    if (file.endsWith('.html')) {
      const name = file.replace('.html', '');
      inputs[name] = path.join(pagesDir, file);
    }
  });

  return inputs;
}

export default defineConfig({
  root: 'src',
  publicDir: false,

  resolve: {
    alias: {
      '@styles': path.resolve(__dirname, 'src/assets/styles'),
      '@scripts': path.resolve(__dirname, 'src/assets/scripts'),
    },
  },

  css: {
    preprocessorOptions: {
      scss: {
        additionalData: '@use "sass:math";',
      },
    },
  },

  build: {
    outDir: '../dist',
    emptyOutDir: true,
    minify: 'esbuild',
    cssMinify: true,
    rollupOptions: {
      input: getHtmlInputs(),
      output: {
        assetFileNames: asset => {
          if (asset.name.endsWith('.css')) {
            return 'assets/styles/[name][extname]';
          }
          return 'assets/[name][extname]';
        },
      },
    },
  },

  plugins: [
    htmlTemplatePlugin(),

    buildPagesFix(),

    picturePlugin(),
    viteSvgPlugin(),
    htmlIconsPlugin(),

    htmlMinifyPlugin(),
    htmlAssetsOrderPlugin(),
  ],
});
