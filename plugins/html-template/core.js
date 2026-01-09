export async function renderTemplate(html, scope, helpers) {
  html = helpers.applyFor(html, scope);
  html = helpers.applyIf(html, scope);
  html = helpers.applyProps(html, scope);
  html = helpers.applySvg(html);

  return await helpers.parseIncludes(html, async (file, block) => {
    const content = helpers.resolveInclude(file);
    const props = helpers.parseProps(block, scope);
    return renderTemplate(content, { ...scope, ...props }, helpers);
  });
}
