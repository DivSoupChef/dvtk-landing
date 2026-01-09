export async function renderTemplate(html, scope, helpers) {
  // ❗ for теперь сам рендерит вложенные include
  html = await helpers.applyFor(html, scope, renderTemplate, helpers);

  html = helpers.applyIf(html, scope);

  html = await helpers.parseIncludes(html, async (file, block) => {
    const content = helpers.resolveInclude(file);
    const props = helpers.parseProps(block, scope);
    return renderTemplate(content, { ...scope, ...props }, helpers);
  });

  html = helpers.applyProps(html, scope);
  html = helpers.applySvg(html);

  return html;
}
