import fs from 'fs';
import path from 'path';

export default function buildPagesFix() {
  return {
    name: 'vite-build-pages-fix',
    apply: 'build',

    closeBundle() {
      const dist = path.resolve('dist');
      const pagesDir = path.join(dist, 'pages');

      if (!fs.existsSync(pagesDir)) {
        console.warn('[pages-fix] pages folder not found');
        return;
      }

      const files = fs.readdirSync(pagesDir);

      for (const file of files) {
        if (!file.endsWith('.html')) continue;

        const from = path.join(pagesDir, file);
        const to = path.join(dist, file);

        fs.copyFileSync(from, to);
        console.log(`[pages-fix] moved ${file} → /dist`);
      }

      // теперь безопасно удаляем pages
      fs.rmSync(pagesDir, { recursive: true, force: true });
      console.log('[pages-fix] pages folder removed');
    },
  };
}
