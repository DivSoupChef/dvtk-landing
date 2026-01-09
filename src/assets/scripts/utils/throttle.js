export function throttle(fn, limit = 200) {
  let wait = false;
  return (...args) => {
    if (!wait) {
      fn(...args);
      wait = true;
      setTimeout(() => (wait = false), limit);
    }
  };
}
