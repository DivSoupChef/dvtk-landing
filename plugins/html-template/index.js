import fs from 'fs';
import path from 'path';

import { extractData } from './data.js';
import { renderTemplate } from './core.js';
import helpers from './helpers.js';

const PAGES_DIR = path.resolve('src/pages');

async function render(html) {
  const { html: cleaned, scope } = await extractData(html);

  const { html: withoutSections, sections } = helpers.extractSections(cleaned);

  scope.sections = sections;

  let result = helpers.applyLayout(withoutSections, sections);

  result = await renderTemplate(result, scope, helpers);

  // 🔥 ВАЖНО: ПОСЛЕ renderTemplate
  result = helpers.applyPicture(result);

  return result;
}

export default function htmlTemplatePlugin() {
  return {
    name: 'vite-html-template',
    enforce: 'pre',

    /* ================= BUILD ================= */

    async transform(code, id) {
      if (!id.endsWith('.html')) return;
      return {
        code: await render(code),
        map: null,
      };
    },

    /* ================= DEV ================= */

    configureServer(server) {
      const dataDir = path.resolve('src/data');

      server.watcher.add(dataDir);

      server.watcher.on('change', file => {
        if (file.startsWith(dataDir)) {
          console.log('[html-template] data changed:', file);

          server.ws.send({
            type: 'full-reload',
          });
        }
      });

      server.watcher.on('add', file => {
        if (file.startsWith(dataDir)) {
          server.ws.send({ type: 'full-reload' });
        }
      });

      server.middlewares.use(async (req, res, next) => {
        if (!req.url) return next();

        const url = req.url.split('?')[0].split('#')[0];
        const page = url === '/' ? 'index' : url.replace(/^\//, '').replace(/\.html$/, '');
        const filePath = path.join(PAGES_DIR, `${page}.html`);

        if (!fs.existsSync(filePath)) return next();

        const raw = fs.readFileSync(filePath, 'utf-8');
        const html = await render(raw);

        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        res.end(html);
      });
    },
  };
}
