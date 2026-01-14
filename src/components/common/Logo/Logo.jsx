import { Link } from 'react-router-dom';
import LogoDesktop from './../../../assets/images/logo-desktop.svg';
import LogoMobile from './../../../assets/images/logo-mobile.svg';

import styles from './Logo.module.scss';

const Logo = () => {
  return (
    <>
    <Link to="/" className={styles.desktop}>
      <img src={LogoDesktop} alt="Логотип КГА ПОУ ДВТК" />
    </Link>
    <Link to="/" className={styles.mobile}>
      <img src={LogoMobile} alt="Логотип КГА ПОУ ДВТК" />
    </Link>
    </>
  );
};

export default Logo;
