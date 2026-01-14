import clsx from 'clsx';

import styles from './Button.module.scss';

import ArrowRight from './../../../assets/icons/arrow-right.svg';

const Button = ({
  children,
  // Содержимое кнопки. Может быть текст или любой JSX.

  icon: Icon,
  // Компонент иконки. Передаётся как ссылка на компонент: icon={MailIcon}.
  // Если не указан — используется иконка по умолчанию.

  iconOnly = false,
  // Если true — кнопка отображает только иконку без текста.

  type = 'button',
  // HTML-тип кнопки: 'button' | 'submit' | 'reset'.

  ariaLabel,
  // aria-label для доступности. Обязателен, если iconOnly=true.

  variant = 'primary',
  // Визуальный вариант кнопки. Должен соответствовать SCSS-модификатору:
  // 'primary' | 'secondary' | 'outline' | 'ghost'

  className = '',

  ...props
  // Любые дополнительные HTML-атрибуты кнопки (onClick, disabled, id и т.д.).
}) => {
  const classes = clsx(styles.button, styles[variant], className);

  const IconComponent = Icon || ArrowRight;

  return (
    <button type={type} aria-label={ariaLabel} className={classes} {...props}>
      {iconOnly ? (
        <IconComponent />
      ) : (
        <>
          <span>{children}</span>
          <IconComponent />
        </>
      )}
    </button>
  );
};

export default Button;
