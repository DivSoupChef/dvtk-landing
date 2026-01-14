import { NavLink } from 'react-router-dom';
import Container from '../../common/Container/Container';
import styles from './Footer.module.scss';

import VkIcon from './../../../assets/icons/vk-icon.svg';
import TgIcon from './../../../assets/icons/tg-icon.svg';
import clsx from 'clsx';

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <Container className={styles.inner}>
        <nav className={styles.menu}>
          <div className={styles.column}>
            <h3 className={styles.footerTitle}>Общая информация</h3>
            <ul className={styles.list}>
              <li>
                <NavLink to="/">Вакатные места для приема (перевод)</NavLink>
              </li>
              <li>
                <NavLink to="/">Открытые вакансии</NavLink>
              </li>
              <li>
                <NavLink to="/">Партнеры</NavLink>
              </li>
            </ul>
          </div>
          <div className={styles.column}>
            <h3 className={styles.footerTitle}>Связь</h3>
            <ul className={styles.list}>
              <li>
                <NavLink to="/">8 (4234) 32-11-44</NavLink>
              </li>
              <li>
                <NavLink to="/">Электронные обращения</NavLink>
              </li>
            </ul>
          </div>
          <div className={styles.column}>
            <h3 className={styles.footerTitle}>Образование</h3>
            <ul className={styles.list}>
              <li>
                <NavLink to="/">Дистанционное образование Moodle</NavLink>
              </li>
              <li>
                <NavLink to="/">Портал сетевой город</NavLink>
              </li>
              <li>
                <NavLink to="/">WorldSkills</NavLink>
              </li>
            </ul>
          </div>
          <div className={styles.column}>
            <h3 className={styles.footerTitle}>Адрес</h3>
            <ul className={styles.list}>
              <li>692519, г. Уссурийск, ул. Советская 35</li>
            </ul>
          </div>
          <div className={styles.column}>
            <h3 className={styles.footerTitle}>Мы также в</h3>
            <ul className={clsx(styles.list, styles.row)}>
              <li>
                <a href="https://vk.com/dvtk_professionalitet" target='_blank'>
                  <VkIcon />
                </a>
              </li>
              <li>
                <a href="https://t.me/dvtk_uss" target='_blank'>
                  <TgIcon />
                </a>
              </li>
            </ul>
          </div>
        </nav>
        <div className={styles.bottom}>
          <p className="_caption">© 2026 КГА ПОУ "ДВТК".</p>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;
