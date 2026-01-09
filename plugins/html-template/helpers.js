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
  let i = 0;

  while (i < html.length) {
    const start = html.indexOf('@include', i);
    if (start === -1) {
      result += html.slice(i);
      break;
    }

    result += html.slice(i, start);

    let j = start + 8;
    while (html[j] === ' ') j++;

    // путь к файлу
    let file = '';
    while (/[\w./-]/.test(html[j])) {
      file += html[j++];
    }

    while (html[j] === ' ') j++;

    // props
    let block = '';
    if (html[j] === '{') {
      let depth = 0;
      let startBlock = j;

      while (j < html.length) {
        if (html[j] === '{') depth++;
        if (html[j] === '}') depth--;
        j++;

        if (depth === 0) break;
      }

      block = html.slice(startBlock, j);
    }

    result += await handler(file, block);
    i = j;
  }

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
