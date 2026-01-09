export async function autoInit(root = document) {
  const nodes = root.querySelectorAll('[data-module]');

  for (const node of nodes) {
    const name = node.dataset.module;

    try {
      const module = await import(`./modules/${name}.js`);
      module.default?.(node);
    } catch (e) {
      console.warn(`Module "${name}" not found`);
    }
  }
}
