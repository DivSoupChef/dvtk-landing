import { useEffect, useRef, useState } from 'react';
import { MENU_ITEMS, SUBMENU_ITEMS } from '../../../constants/navigation';
import { NavLink } from 'react-router-dom';
import clsx from 'clsx';

import Button from '../../common/Button/Button';
import Logo from '../../common/Logo/Logo';

import styles from './Header.module.scss';

import IconSearch from './../../../assets/icons/search-icon.svg';
import IconEye from './../../../assets/icons/eye-icon.svg';
import IconCall from './../../../assets/icons/call-icon.svg';
import IconMenu from './../../../assets/icons/menu-icon.svg';

import Container from '../../common/Container/Container';
import MobileMenu from '../MobileMenu/MobileMenu';
import SearchBar from '../SearchBar/SearchBar';
import { useMobileMenu, useSearchBar } from '../../../context/AppContext';

const Header = () => {
  const [openMenuId, setOpenMenuId] = useState(null);

  const { toggleMenu, isOpen } = useMobileMenu();
  const { openSearchBar, closeSearchBar, isActive } = useSearchBar();

  const menuRef = useRef(null);
  const scrollRef = useRef(null);

  const toggleDropdown = id => {
    setOpenMenuId(prev => (prev === id ? null : id));
  };

  const splitToColumns = items => {
    const middle = Math.ceil(items.length / 2);
    return [items.slice(0, middle), items.slice(middle)];
  };

  useEffect(() => {
    scrollRef.current.addEventListener('wheel', e => {
      if (e.deltaY === 0) return;

      e.preventDefault();
      scrollRef.current.scrollLeft += e.deltaY;
    });
  }, []);

  useEffect(() => {
    const handleClickOutside = event => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpenMenuId(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className={styles.header}>
      <div className={styles.headerBar}>
        <Container className={styles.inner}>
          <Logo />
          <nav className={styles.menu}>
            {MENU_ITEMS.map(item => (
              <NavLink key={item.id} to={item.to}>
                {item.label}
              </NavLink>
            ))}
          </nav>
          <div className={styles.buttons}>
            <Button
              iconOnly="true"
              onClick={() => openSearchBar()}
              icon={IconSearch}
              variant="icon"
              ariaLabel="Поиск"
            />
            <Button iconOnly="true" icon={IconEye} variant="icon" ariaLabel="Режим для слабовидящих" />
            <Button iconOnly="true" icon={IconCall} variant="icon" ariaLabel="Заказать звонок" />
            <Button
              className={styles.menuIcon}
              iconOnly="true"
              onClick={() => toggleMenu()}
              icon={IconMenu}
              variant="icon"
              ariaLabel="Мобильное меню"
            />
          </div>
        </Container>
      </div>
      <div className={styles.headerExpanded}>
        <Container>
          <nav className={styles.navWrapper} ref={menuRef}>
            <div className={styles.navScroll} ref={scrollRef}>
              <div className={styles.nav}>
                {SUBMENU_ITEMS.map(item => (
                  <Button
                    className={clsx(styles.menuButton, openMenuId === item.id ? styles.active : '')}
                    key={item.id}
                    variant="ghost"
                    onClick={() => toggleDropdown(item.id)}
                    data-id={item.id}
                    ariaLabel={item.label}>
                    {item.label}
                  </Button>
                ))}
              </div>
            </div>

            {SUBMENU_ITEMS.map(item => {
              const [col1, col2] = splitToColumns(item.dropdown);

              return (
                <div key={item.id} className={clsx(styles.dropdown, openMenuId === item.id && styles.open)}>
                  <Container className={styles.grid}>
                    <div className={styles.column}>
                      {col1.map(link => (
                        <NavLink
                          key={link.id}
                          to={link.to}
                          className={styles.dropdownLink}
                          onClick={() => setOpenMenuId(null)}>
                          {link.label}
                        </NavLink>
                      ))}
                    </div>
                    <div className={styles.column}>
                      {col2.map(link => (
                        <NavLink
                          key={link.id}
                          to={link.to}
                          className={styles.dropdownLink}
                          onClick={() => setOpenMenuId(null)}>
                          {link.label}
                        </NavLink>
                      ))}
                    </div>
                  </Container>
                </div>
              );
            })}
          </nav>
        </Container>
      </div>
      <MobileMenu openMenu={isOpen} />
      <SearchBar openSearchBar={isActive} onClose={closeSearchBar} />
    </header>
  );
};

export default Header;
