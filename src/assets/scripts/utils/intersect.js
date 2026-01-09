export function observe(selector, cb, options = {}) {
  const io = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        cb(entry.target);
        obs.unobserve(entry.target);
      }
    });
  }, options);

  document.querySelectorAll(selector).forEach(el => io.observe(el));
}
