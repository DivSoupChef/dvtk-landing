import fs from 'fs';
import path from 'path';
import { minify } from 'html-minifier-terser';

const DIST_DIR = path.resolve('dist');

export default function htmlMinifyPlugin() {
  return {
    name: 'vite-html-minify',
    apply: 'build',

    async closeBundle() {
      const files = walk(DIST_DIR);

      for (const file of files) {
        if (!file.endsWith('.html')) continue;

        const html = fs.readFileSync(file, 'utf-8');

        const minified = await minify(html, {
          collapseWhitespace: true,
          removeComments: true,
          removeRedundantAttributes: true,
          removeEmptyAttributes: true,
          minifyCSS: true,
          minifyJS: true,
          keepClosingSlash: true,
        });

        fs.writeFileSync(file, minified);
      }
    },
  };
}

/* helpers */

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
    const full = path.join(dir, entry.name);
    return entry.isDirectory() ? walk(full) : full;
  });
}
