import fs from 'fs';
import path from 'path';
import { parse } from 'node-html-parser';

const SRC_ROOT = path.resolve('src');
const PICTURE_DEFAULTS = {
  formats: ['avif', 'webp', 'jpg'],
  breakpoints: [320, 640, 960, 1280],
  sizes: '(max-width: 768px) 100vw, 50vw',
  loading: 'lazy',
  decoding: 'async',
  fetchpriority: 'auto',
};

function get(obj, pathStr) {
  return pathStr.split('.').reduce((a, k) => a?.[k], obj);
}

/* ===== PICTURE ===== */

function applyPicture(html, options = {}) {
  const opts = {
    ...PICTURE_DEFAULTS,
    ...options,
  };

  const root = parse(html);

  root.querySelectorAll('[data-picture]').forEach(node => {
    const src = node.getAttribute('data-src');
    const alt = node.getAttribute('data-alt') ?? '';
    const width = node.getAttribute('data-width');
    const height = node.getAttribute('data-height');

    if (!src) return;

    // DEV / SSR / PREVIEW — простой img
    node.replaceWith(
      `
<img
  src="/assets/images/${src}.jpg"
  alt="${alt}"
  ${width ? `width="${width}"` : ''}
  ${height ? `height="${height}"` : ''}
  loading="${opts.loading}"
  decoding="${opts.decoding}"
>
`.trim(),
    );
  });

  return root.toString();
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

function applyLayout(html, sections = {}) {
  const match = html.match(/@layout\s+([\w./-]+)/);
  if (!match) return html;

  const layoutPath = path.resolve('src', match[1]);
  let layoutHtml = fs.readFileSync(layoutPath, 'utf-8');

  html = html.replace(match[0], '').trim();

  sections.content ??= html;

  layoutHtml = applySections(layoutHtml, sections);

  return layoutHtml;
}

/* ===== SECTION ===== */

/* ===== SECTION ===== */

function extractSections(html) {
  const sections = {};
  const RE = /@section\s+(\w+)([\s\S]*?)@endsection/g;

  html = html.replace(RE, (_, name, body) => {
    sections[name] = body.trim();
    return '';
  });

  return { html, sections };
}

function applySections(html, sections = {}) {
  return html.replace(/@section\s+(\w+)/g, (_, name) => {
    return sections[name] ?? '';
  });
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

async function replaceAsync(str, regex, asyncFn) {
  const matches = [];
  str.replace(regex, (...args) => {
    matches.push(args);
    return '';
  });

  let result = '';
  let lastIndex = 0;

  for (const match of matches) {
    const [fullMatch, ...rest] = match;
    const index = match[match.length - 2];

    result += str.slice(lastIndex, index);
    result += await asyncFn(...match);
    lastIndex = index + fullMatch.length;
  }

  result += str.slice(lastIndex);
  return result;
}

async function applyFor(html, scope, renderTemplate, helpers) {
  const RE = /@for\s+(\w+)\s+in\s+([\w.]+)([\s\S]*?)@endfor/g;

  return await replaceAsync(html, RE, async (_, itemName, listName, body) => {
    const list = get(scope, listName);
    if (!Array.isArray(list)) return '';

    let result = '';

    for (const item of list) {
      const localScope = {
        ...scope,
        [itemName]: item,
      };

      result += await renderTemplate(body, localScope, helpers);
    }

    return result;
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
  const base = path.join(SRC_ROOT, file);

  if (!fs.existsSync(base)) return '';

  const stat = fs.statSync(base);

  // 1️⃣ Если это файл — читаем
  if (stat.isFile()) {
    return fs.readFileSync(base, 'utf-8');
  }

  // 2️⃣ Если это папка — ищем index.html или <name>.html
  if (stat.isDirectory()) {
    const indexFile = path.join(base, 'index.html');
    const namedFile = base + '.html';

    if (fs.existsSync(indexFile)) {
      return fs.readFileSync(indexFile, 'utf-8');
    }

    if (fs.existsSync(namedFile)) {
      return fs.readFileSync(namedFile, 'utf-8');
    }
  }

  return '';
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
  extractSections,
  applySections,
  parseProps,
  applyProps,
  applyIf,
  applyFor,
  applySvg,
  resolveInclude,
  parseIncludes,
  applyPicture,
};
