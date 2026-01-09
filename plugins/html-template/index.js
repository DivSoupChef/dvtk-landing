import { extractData } from './data.js';
import { renderTemplate } from './core.js';
import helpers from './helpers.js';

export default function htmlTemplatePlugin() {
  return {
    name: 'vite-html-template',
    enforce: 'post',

    async transformIndexHtml(html) {
      const { html: cleaned, scope } = await extractData(html);
      const withLayout = helpers.applyLayout(cleaned);
      const rendered = await renderTemplate(withLayout, scope, helpers);

      return rendered;
    },
  };
}
