import fs from 'fs';
import path from 'path';

export default function devPagesRouter() {
  return {
    name: 'vite-dev-pages-router',

    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (!req.url) return next();

        // Убираем query и hash
        const cleanUrl = req.url.split('?')[0].split('#')[0];

        // Пропускаем ассеты (но НЕ html)
        if (cleanUrl.includes('.') && !cleanUrl.endsWith('.html')) {
          return next();
        }

        let page = cleanUrl === '/' ? 'index' : cleanUrl.slice(1);

        // Убираем .html если есть
        page = page.replace(/\.html$/, '');

        const filePath = path.resolve('src/pages', `${page}.html`);

        if (fs.existsSync(filePath)) {
          req.url = `/pages/${page}.html`;
        }

        next();
      });
    },
  };
}
