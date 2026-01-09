export default function accordion(root) {
  root.querySelector('.accordion__header')?.addEventListener('click', () => {
    root.classList.toggle('is-open');
  });
}
