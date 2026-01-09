let scrollY = 0;

export function lockScroll() {
  scrollY = window.scrollY;
  document.body.style.top = `-${scrollY}px`;
  document.body.classList.add('no-scroll');
}

export function unlockScroll() {
  document.body.classList.remove('no-scroll');
  window.scrollTo(0, scrollY);
  document.body.style.top = '';
}
