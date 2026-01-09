export default function htmlIconsPlugin() {
  function transformIcons(html) {
    return html.replace(/<(\w+)[^>]*data-icon="([\w-]+)"[^>]*><\/\1>/g, (_, tag, icon) =>
      `
<svg class="icon icon--${icon}" aria-hidden="true">
  <use href="/assets/svg/sprite.svg#${icon}"></use>
</svg>
`.trim(),
    );
  }

  return {
    name: 'vite-html-icons',

    transformIndexHtml(html) {
      return transformIcons(html);
    },

    handleHotUpdate({ file, server }) {
      if (file.endsWith('.html')) {
        server.ws.send({ type: 'full-reload' });
      }
    },
  };
}
