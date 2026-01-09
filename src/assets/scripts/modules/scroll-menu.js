export default function initScrollMenu() {
  const submenu = document.querySelector('.header-expanded__submenu');

  submenu.addEventListener(
    'wheel',
    e => {
      if (e.deltaY === 0) return;

      e.preventDefault();
      submenu.scrollLeft += e.deltaY;
    },
    { passive: false },
  );
}
