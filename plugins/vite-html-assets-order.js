export default function htmlAssetsOrderPlugin() {
  return {
    name: 'vite-html-assets-order',
    apply: 'build',

    transformIndexHtml: {
      order: 'post',

      handler(html) {
        /* ===== CSS ===== */
        const links = [];
        html = html.replace(/<link\s+[^>]*rel=["']stylesheet["'][^>]*>/g, m => {
          links.push(m);
          return '';
        });

        /* ===== SCRIPTS ===== */
        const scripts = [];
        html = html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/g, m => {
          scripts.push(m);
          return '';
        });

        /* ===== INSERT ===== */
        html = html.replace('</head>', `${links.join('\n')}\n</head>`);

        html = html.replace('</body>', `${scripts.join('\n')}\n</body>`);

        return html;
      },
    },
  };
}
