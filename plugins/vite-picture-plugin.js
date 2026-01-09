import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { parse } from 'node-html-parser';

/* ================== DEFAULT OPTIONS ================== */

const DEFAULTS = {
  formats: ['avif', 'webp', 'jpg'], // порядок важен (от лучшего к fallback)
  breakpoints: [320, 640, 960, 1280],
  sizes: '(max-width: 768px) 100vw, 50vw',
  loading: 'lazy',
  decoding: 'async',
  fetchpriority: 'auto',
  quality: {
    jpg: 85,
    webp: 80,
    avif: 50,
    png: 9,
  },
};

/* ================== PATHS ================== */

const IMAGE_SRC = path.resolve('src/assets/images');
const IMAGE_DIST = path.resolve('dist/assets/images');
const DIST_DIR = path.resolve('dist');

/* ================== PLUGIN ================== */

export default function vitePicturePlugin(userOptions = {}) {
  const options = mergeOptions(DEFAULTS, userOptions);
  let command = 'serve';

  return {
    name: 'vite-picture-plugin',
    enforce: 'post',

    configResolved(config) {
      command = config.command;
    },

    /* -------- DEV -------- */
    transformIndexHtml(html) {
      if (command === 'serve') {
        return transformHtmlDev(html, options);
      }
      return html;
    },

    /* -------- BUILD -------- */
    async closeBundle() {
      if (command !== 'build') return;

      await processImages(options);
      transformHtmlBuild(options);
    },
  };
}

/* ================== IMAGE PIPELINE ================== */

async function processImages(options) {
  const files = walk(IMAGE_SRC);
  const generated = new Set();

  for (const file of files) {
    const rel = path.relative(IMAGE_SRC, file);
    const dir = path.dirname(rel) === '.' ? '' : path.dirname(rel);
    const ext = path.extname(rel);
    const base = path.basename(rel, ext);

    const outDir = path.join(IMAGE_DIST, dir);
    fs.mkdirSync(outDir, { recursive: true });

    const image = sharp(file);
    const meta = await image.metadata();

    /* ---- Responsive ---- */
    for (const size of options.breakpoints) {
      if (!meta.width || size >= meta.width) continue;

      for (const format of options.formats) {
        const name = `${base}-${size}.${format}`;
        if (generated.has(name)) continue;

        const pipeline = image.clone().resize({ width: size, withoutEnlargement: true });

        await applyFormat(pipeline, format, options.quality[format]).toFile(path.join(outDir, name));

        generated.add(name);
      }
    }

    /* ---- Original size ---- */
    for (const format of options.formats) {
      const name = `${base}.${format}`;
      if (generated.has(name)) continue;

      const pipeline = image.clone();

      await applyFormat(pipeline, format, options.quality[format]).toFile(path.join(outDir, name));

      generated.add(name);
    }
  }
}

/* ================== FORMAT HANDLER ================== */

function applyFormat(image, format, quality) {
  switch (format) {
    case 'jpg':
    case 'jpeg':
      return image.jpeg({ quality });
    case 'png':
      return image.png({ compressionLevel: quality });
    case 'webp':
      return image.webp({ quality });
    case 'avif':
      return image.avif({ quality });
    default:
      throw new Error(`Unsupported image format: ${format}`);
  }
}

/* ================== HTML (DEV) ================== */

function transformHtmlDev(html, options) {
  const root = parse(html);

  root.querySelectorAll('[data-picture]').forEach(node => {
    const src = node.getAttribute('data-src');
    const alt = node.getAttribute('data-alt') ?? '';
    const width = node.getAttribute('data-width');
    const height = node.getAttribute('data-height');

    if (!src) return;

    node.replaceWith(
      `
<img
  src="/assets/images/${src}.jpg"
  alt="${alt}"
  ${width ? `width="${width}"` : ''}
  ${height ? `height="${height}"` : ''}
  loading="${options.loading}"
  decoding="${options.decoding}"
>
`.trim(),
    );
  });

  return root.toString();
}

/* ================== HTML (BUILD) ================== */

function transformHtmlBuild(options) {
  const htmlFiles = walkHtml(DIST_DIR);

  for (const file of htmlFiles) {
    const html = fs.readFileSync(file, 'utf-8');
    const root = parse(html);

    root.querySelectorAll('[data-picture]').forEach(node => {
      const src = node.getAttribute('data-src');
      const alt = node.getAttribute('data-alt') ?? '';
      const width = node.getAttribute('data-width');
      const height = node.getAttribute('data-height');

      if (!src) return;

      node.replaceWith(buildPicture(src, alt, width, height, options));
    });

    fs.writeFileSync(file, root.toString());
  }
}

function buildPicture(src, alt, width, height, options) {
  return `
<picture>
${options.formats
  .map(
    format => `
  <source
    type="image/${format}"
    srcset="${options.breakpoints
      .map(w => `/assets/images/${src}-${w}.${format} ${w}w`)
      .join(', ')}, /assets/images/${src}.${format}"
    sizes="${options.sizes}"
  >
`,
  )
  .join('')}
  <img
    src="/assets/images/${src}.jpg"
    alt="${alt}"
    ${width ? `width="${width}"` : ''}
    ${height ? `height="${height}"` : ''}
    loading="${options.loading}"
    decoding="${options.decoding}"
    fetchpriority="${options.fetchpriority}"
  >
</picture>
`.trim();
}

/* ================== HELPERS ================== */

function walk(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir, { withFileTypes: true })
    .flatMap(entry => (entry.isDirectory() ? walk(path.join(dir, entry.name)) : path.join(dir, entry.name)));
}

function walkHtml(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return walkHtml(full);
    if (entry.name.endsWith('.html')) return full;
    return [];
  });
}

function mergeOptions(base, extra) {
  return {
    ...base,
    ...extra,
    quality: {
      ...base.quality,
      ...(extra.quality || {}),
    },
  };
}
