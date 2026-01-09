import fs from 'fs';
import path from 'path';

const SRC_ROOT = path.resolve('src');

export default function htmlIncludeProps() {
  /* ================= PROPS ================= */

  function parseProps(block = '') {
    if (!block) return {};

    const raw = block
      .trim()
      .replace(/^\{|\}$/g, '')
      .replace(/\{\{\s*([\w.]+)\s*\}\}/g, (_, expr) => expr.split('.').reduce((a, k) => a?.[k], scope) ?? '');

    try {
      return Function(`return ({${raw}})`)();
    } catch {
      const props = {};
      const RE = /(\w+)\s*:\s*([^\n]+)/g;
      let m;

      while ((m = RE.exec(raw))) {
        props[m[1]] = m[2].trim();
      }
      return props;
    }
  }

  /* ================= TEMPLATE ================= */

  function applyProps(html, scope) {
    return html.replace(/\{\{\s*([\w.]+)\s*\}\}/g, (_, expr) => expr.split('.').reduce((a, k) => a?.[k], scope) ?? '');
  }

  function applyIf(html, scope) {
    const IF_START = /@if\s+([^\s]+)/g;
    let match;

    while ((match = IF_START.exec(html))) {
      const startIndex = match.index;
      const expr = match[1];

      let depth = 1;
      let i = IF_START.lastIndex;

      while (i < html.length) {
        if (html.startsWith('@if', i)) depth++;
        else if (html.startsWith('@endif', i)) depth--;

        if (depth === 0) break;
        i++;
      }

      const endIndex = i + 6; // '@endif'.length
      const body = html.slice(IF_START.lastIndex, i);

      const value = expr.split('.').reduce((a, k) => a?.[k], scope);

      html = html.slice(0, startIndex) + (value ? body : '') + html.slice(endIndex);

      IF_START.lastIndex = 0; // перезапуск поиска
    }

    return html;
  }

  function getByPath(obj, path) {
    return path.split('.').reduce((a, k) => a?.[k], obj);
  }

  function applyFor(html, scope) {
    while (true) {
      const match = html.match(/@for\s+(\w+)\s+in\s+([^\s]+)/);
      if (!match) break;

      const [fullMatch, item, listPath] = match;
      const start = match.index;

      let depth = 1;
      let i = start + fullMatch.length;

      while (i < html.length) {
        if (html.startsWith('@for', i)) depth++;
        else if (html.startsWith('@endfor', i)) depth--;

        if (depth === 0) break;
        i++;
      }

      const body = html.slice(start + fullMatch.length, i);
      const end = i + 7; // '@endfor'.length

      const arr = getByPath(scope, listPath);
      if (!Array.isArray(arr)) {
        html = html.slice(0, start) + html.slice(end);
        continue;
      }

      const rendered = arr
        .map(value => {
          const local = { ...scope, [item]: value };
          let out = body;
          out = applyFor(out, local);
          out = applyIf(out, local);
          out = applyProps(out, local);
          out = applySvg(out);
          return out;
        })
        .join('');

      html = html.slice(0, start) + rendered + html.slice(end);
    }

    return html;
  }

  function applySvg(html) {
    return html.replace(/@svg\((.+?)\)/g, (_, file) => {
      const svgPath = path.resolve('src/assets/svg/inline', file.trim());
      if (!fs.existsSync(svgPath)) return '';
      return fs.readFileSync(svgPath, 'utf-8').replace(/\n/g, '').trim();
    });
  }

  /* ================= INCLUDE ================= */

  function resolveInclude(file) {
    const full = path.join(SRC_ROOT, file);
    if (!fs.existsSync(full)) {
      console.warn('[include not found]', file);
      return '';
    }
    return fs.readFileSync(full, 'utf-8');
  }

  function parseIncludes(html, handler) {
    let out = '';
    let i = 0;

    while (i < html.length) {
      const idx = html.indexOf('@include', i);
      if (idx === -1) {
        out += html.slice(i);
        break;
      }

      out += html.slice(i, idx);
      i = idx + 8;

      const nameMatch = html.slice(i).match(/\s+([\w./-]+)/);
      if (!nameMatch) continue;

      const file = nameMatch[1];
      i += nameMatch.index + file.length + 1;

      while (/\s/.test(html[i])) i++;

      let block = '';
      if (html[i] === '{') {
        let depth = 0;
        let j = i;

        while (j < html.length) {
          if (html[j] === '{') depth++;
          if (html[j] === '}') depth--;
          if (depth === 0) break;
          j++;
        }

        block = html.slice(i, j + 1);
        i = j + 1;
      }

      out += handler(file, block);
    }

    return out;
  }

  /* ================= PROCESS ================= */

  function process(html, scope = {}) {
    html = applyFor(html, scope);
    html = applyIf(html, scope);
    html = applyProps(html, scope);
    html = applySvg(html);

    return parseIncludes(html, (file, block) => {
      const content = resolveInclude(file);
      const props = parseProps(block, scope);
      return process(content, { ...scope, ...props });
    });
  }

  return {
    name: 'vite-html-include-props',

    transformIndexHtml: {
      order: 'pre',
      handler(html) {
        return process(html);
      },
    },
  };
}
