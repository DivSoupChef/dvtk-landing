import fs from 'fs';
import path from 'path';
import { optimize } from 'svgo';

const ICONS_DIR = path.resolve('src/assets/svg/icons');
const DEV_SPRITE = path.resolve('src/assets/svg/sprite.svg');
const BUILD_SPRITE = path.resolve('dist/assets/svg/sprite.svg');

export default function viteSvgPlugin() {
  let command = 'serve';

  function generateSprite() {
    if (!fs.existsSync(ICONS_DIR)) return '';

    const symbols = fs
      .readdirSync(ICONS_DIR)
      .filter(f => f.endsWith('.svg'))
      .map(file => {
        const id = path.basename(file, '.svg');
        const raw = fs.readFileSync(path.join(ICONS_DIR, file), 'utf-8');

        const { data } = optimize(raw, {
          plugins: [
            'removeDimensions',
            'removeXMLNS',
            {
              name: 'removeAttrs',
              params: { attrs: '(fill|stroke="#[^"]*")' },
            },
          ],
        });

        const content = data.replace('<svg', `<symbol id="${id}"`).replace('</svg>', '</symbol>');

        return content;
      })
      .join('\n');

    return `
<svg xmlns="http://www.w3.org/2000/svg" style="display:none">
${symbols}
</svg>
`.trim();
  }

  function writeSprite(filePath) {
    const sprite = generateSprite();
    if (!sprite) return;

    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    fs.writeFileSync(filePath, sprite);
  }

  return {
    name: 'vite-svg-plugin',
    enforce: 'pre',

    configResolved(config) {
      command = config.command;
    },

    buildStart() {
      // DEV
      if (command === 'serve') {
        writeSprite(DEV_SPRITE);
      }
    },

    closeBundle() {
      // BUILD
      if (command === 'build') {
        writeSprite(BUILD_SPRITE);
      }
    },

    handleHotUpdate({ file, server }) {
      if (file.startsWith(ICONS_DIR)) {
        writeSprite(DEV_SPRITE);
        server.ws.send({ type: 'full-reload' });
      }
    },
  };
}
