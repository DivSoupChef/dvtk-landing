export default function form(root) {
  root.addEventListener('submit', e => {
    if (!root.checkValidity()) {
      e.preventDefault();
      root.classList.add('has-error');
      return;
    }

    e.preventDefault();

    const data = Object.fromEntries(new FormData(root));

    console.log('submit:', data);

    root.reset();
  });
}
