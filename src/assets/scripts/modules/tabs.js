import { $$ } from '../utils/dom.js';

export function initTabs() {
  $$('.tabs').forEach(tabs => {
    const buttons = $$('.tabs__btn', tabs);
    const panels = $$('.tabs__panel', tabs);

    buttons.forEach((btn, i) => {
      btn.addEventListener('click', () => {
        buttons.forEach(b => b.classList.remove('is-active'));
        panels.forEach(p => p.classList.remove('is-active'));

        btn.classList.add('is-active');
        panels[i].classList.add('is-active');
      });
    });
  });
}
