import fs from 'fs';
import path from 'path';
import { pathToFileURL } from 'url';

export async function extractData(html) {
  const scope = {};
  const RE = /@data\s+(\w+)\s+from\s+"([^"]+)"/g;

  // 1️⃣ Собираем все директивы
  const matches = [...html.matchAll(RE)];

  for (const match of matches) {
    const [, name, source] = match;
    scope[name] = await loadSource(source);
  }

  // 2️⃣ Удаляем ВСЕ @data за один раз
  html = html.replace(RE, '').trim();

  return { html, scope };
}

async function loadSource(src) {
  if (src.startsWith('http')) {
    const res = await fetch(src);
    return res.json();
  }

  const full = path.resolve('src', src.replace(/^\.?\//, ''));

  if (full.endsWith('.js')) {
    const url = pathToFileURL(full).href;
    const mod = await import(url);
    return mod.default ?? mod;
  }

  if (full.endsWith('.json')) {
    return JSON.parse(fs.readFileSync(full, 'utf-8'));
  }

  return null;
}
