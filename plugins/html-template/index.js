import fs from 'fs';
import path from 'path';

import { extractData } from './data.js';
import { renderTemplate } from './core.js';
import helpers from './helpers.js';

const PAGES_DIR = path.resolve('src/pages');

async function render(html) {
  // 1️⃣ @data
  const { html: cleaned, scope } = await extractData(html);

  // 2️⃣ @section (ВАЖНО!)
  const { html: withoutSections, sections } = helpers.extractSections(cleaned);

  // кладём секции в scope
  scope.sections = sections;

  // 3️⃣ @layout (ПОСЛЕ section)
  const withLayout = helpers.applyLayout(withoutSections, sections);

  // 4️⃣ include / for / if / props / svg
  return await renderTemplate(withLayout, scope, helpers);
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
