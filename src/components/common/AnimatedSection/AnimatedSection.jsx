import clsx from 'clsx';
import styles from './AnimatedSection.module.scss';
import { useEffect, useRef, useState } from 'react';

export default function AnimatedSection({
  children,
  animation = 'fade-up',
  delay = 0,
  once = true,
  lazy = false,
  immediate = false,
  rootMargin = '0px',
  className,
}) {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);
  

  // 👉 Если immediate — запускаем анимацию после первого рендера
  useEffect(() => {
    if (immediate) {
      setShouldRender(true);
      // небольшая задержка в один тик, чтобы браузер увидел смену классов
      requestAnimationFrame(() => setIsVisible(true));
    }
  }, [immediate]);

  // 👉 Обычный IntersectionObserver
  useEffect(() => {
    if (immediate) return;

    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldRender(true);
          requestAnimationFrame(() => setIsVisible(true));
          if (once) observer.unobserve(node);
        } else if (!once) {
          setIsVisible(false);
        }
      },
      { threshold: 0.2, rootMargin },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [once, rootMargin, immediate]);

  const content = lazy ? shouldRender && children : children;

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}s` }}
      className={clsx(styles.animate, styles[animation], isVisible && styles.visible, className)}>
      {content}
    </div>
  );
}
