import fs from 'fs';
import path from 'path';

const SRC_ROOT = path.resolve('src');

function get(obj, pathStr) {
  return pathStr.split('.').reduce((a, k) => a?.[k], obj);
}

/* ===== PROPS ===== */

function parseProps(block = '', scope = {}) {
  if (!block) return {};

  const raw = block.trim().replace(/^\{|\}$/g, '');

  try {
    return Function('scope', `with(scope){ return ({${raw}}) }`)(scope);
  } catch {
    return {};
  }
}

function applyProps(html, scope) {
  return html.replace(/\{\{\s*([\w.]+)\s*\}\}/g, (_, expr) => {
    const val = get(scope, expr);
    return val ?? '';
  });
}

/* ===== LAYOUT ===== */

export function applyLayout(html) {
  const match = html.match(/@layout\s+([\w./-]+)/);
  if (!match) return html;

  const layoutPath = path.resolve('src', match[1]);
  const layoutHtml = fs.readFileSync(layoutPath, 'utf-8');

  html = html.replace(match[0], '').trim();
  return layoutHtml.replace('{{ content }}', html);
}

/* ===== IF ===== */

function applyIf(html, scope) {
  const RE = /@if\s+([^\n]+)([\s\S]*?)@endif/g;

  return html.replace(RE, (_, expr, body) => {
    try {
      const result = Function('scope', `with(scope){ return ${expr} }`)(scope);
      return result ? body : '';
    } catch {
      return '';
    }
  });
}

/* ===== FOR ===== */

function applyFor(html, scope) {
  const RE = /@for\s+(\w+)\s+in\s+([^\n]+)([\s\S]*?)@endfor/g;

  return html.replace(RE, (_, item, listExpr, body) => {
    const list = get(scope, listExpr.trim());
    if (!Array.isArray(list)) return '';

    return list
      .map(val => {
        const local = { ...scope, [item]: val };
        return applyFor(applyIf(applyProps(body, local), local), local);
      })
      .join('');
  });
}

/* ===== SVG ===== */

function applySvg(html) {
  return html.replace(/@svg\((.+?)\)/g, (_, file) => {
    const svgPath = path.join(SRC_ROOT, 'assets/svg/inline', file.trim());
    if (!fs.existsSync(svgPath)) return '';
    return fs.readFileSync(svgPath, 'utf-8').replace(/\n/g, '');
  });
}

/* ===== INCLUDE ===== */

function resolveInclude(file) {
  const full = path.join(SRC_ROOT, file);
  if (!fs.existsSync(full)) return '';
  return fs.readFileSync(full, 'utf-8');
}

async function parseIncludes(html, handler) {
  let result = '';
  let index = 0;

  const RE = /@include\s+([\w./-]+)(\s*\{[\s\S]*?\})?/g;
  let match;

  while ((match = RE.exec(html))) {
    const [full, file, block] = match;

    result += html.slice(index, match.index);

    // ВАЖНО: await
    result += await handler(file, block);

    index = match.index + full.length;
  }

  result += html.slice(index);
  return result;
}

export default {
  applyLayout,
  parseProps,
  applyProps,
  applyIf,
  applyFor,
  applySvg,
  resolveInclude,
  parseIncludes,
};
