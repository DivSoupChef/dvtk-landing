import { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { NavLink } from 'react-router-dom';
import clsx from 'clsx';

import { MENU_ITEMS, SUBMENU_ITEMS } from '../../../constants/navigation';
import { useMobileMenu, useSearchBar } from '../../../context/AppContext';

import Container from '../../common/Container/Container';
import Button from '../../common/Button/Button';
import Logo from '../../common/Logo/Logo';
import MobileMenu from '../MobileMenu/MobileMenu';
import SearchBar from '../SearchBar/SearchBar';

import styles from './Header.module.scss';

import IconSearch from '../../../assets/icons/search-icon.svg';
import IconEye from '../../../assets/icons/eye-icon.svg';
import IconCall from '../../../assets/icons/call-icon.svg';
import IconMenu from '../../../assets/icons/menu-icon.svg';

/* ---------------- helpers ---------------- */

const splitToColumns = items => {
  const middle = Math.ceil(items.length / 2);
  return [items.slice(0, middle), items.slice(middle)];
};

const Header = () => {
  const [openMenuId, setOpenMenuId] = useState(null);

  const { toggleMenu, isOpen } = useMobileMenu();
  const { openSearchBar, closeSearchBar, isActive } = useSearchBar();

  const menuRef = useRef(null);
  const scrollRef = useRef(null);

  /* memoized dropdown data */
  const dropdownData = useMemo(
    () =>
      SUBMENU_ITEMS.map(item => ({
        ...item,
        columns: splitToColumns(item.dropdown),
      })),
    [],
  );

  const toggleDropdown = useCallback(id => {
    setOpenMenuId(prev => (prev === id ? null : id));
  }, []);

  const closeDropdown = useCallback(() => {
    setOpenMenuId(null);
  }, []);

  /* horizontal wheel scroll */
  useEffect(() => {
    const node = scrollRef.current;
    if (!node) return;

    const onWheel = e => {
      if (e.deltaY === 0) return;
      e.preventDefault();
      node.scrollLeft += e.deltaY;
    };

    node.addEventListener('wheel', onWheel, { passive: false });

    return () => node.removeEventListener('wheel', onWheel);
  }, []);

  /* click outside dropdown */
  useEffect(() => {
    const handleClickOutside = e => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        closeDropdown();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [closeDropdown]);

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
            <Button iconOnly icon={IconSearch} variant="icon" ariaLabel="Поиск" onClick={openSearchBar} />
            <Button iconOnly icon={IconEye} variant="icon" ariaLabel="Режим для слабовидящих" />
            <Button iconOnly icon={IconCall} variant="icon" ariaLabel="Заказать звонок" />
            <Button
              iconOnly
              className={styles.menuIcon}
              icon={IconMenu}
              variant="icon"
              ariaLabel="Мобильное меню"
              onClick={toggleMenu}
            />
          </div>
        </Container>
      </div>

      <div className={styles.headerExpanded}>
        <Container>
          <nav className={styles.navWrapper} ref={menuRef}>
            <div className={styles.navScroll} ref={scrollRef}>
              <div className={styles.nav}>
                {dropdownData.map(item => (
                  <Button
                    key={item.id}
                    variant="ghost"
                    className={clsx(styles.menuButton, {
                      [styles.active]: openMenuId === item.id,
                    })}
                    onClick={() => toggleDropdown(item.id)}
                    ariaLabel={item.label}>
                    {item.label}
                  </Button>
                ))}
              </div>
            </div>

            {dropdownData.map(item => (
              <div
                key={item.id}
                className={clsx(styles.dropdown, {
                  [styles.open]: openMenuId === item.id,
                })}>
                <Container className={styles.grid}>
                  {item.columns.map((col, idx) => (
                    <div key={idx} className={styles.column}>
                      {col.map(link => (
                        <NavLink key={link.id} to={link.to} className={styles.dropdownLink} onClick={closeDropdown}>
                          {link.label}
                        </NavLink>
                      ))}
                    </div>
                  ))}
                </Container>
              </div>
            ))}
          </nav>
        </Container>
      </div>

      <MobileMenu openMenu={isOpen} />
      <SearchBar openSearchBar={isActive} onClose={closeSearchBar} />
    </header>
  );
};

export default Header;
