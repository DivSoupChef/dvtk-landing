import { $ } from '../utils/dom.js';
import { lockScroll, unlockScroll } from '../helpers/lock-scroll.js';

export function initBurger() {
  const btn = $('.burger');
  const menu = $('.menu');

  if (!btn || !menu) return;

  btn.addEventListener('click', () => {
    const open = menu.classList.toggle('is-open');
    btn.classList.toggle('is-active', open);
    open ? lockScroll() : unlockScroll();
  });
}
