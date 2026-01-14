import { NavLink } from 'react-router-dom';
import { MENU_ITEMS, SUBMENU_ITEMS } from '../../../constants/navigation';
import styles from './MobileMenu.module.scss';
import Button from '../../common/Button/Button';
import { useState, useRef } from 'react';
import clsx from 'clsx';

const MobileMenu = ({ openMenu }) => {
  const [openMenuId, setOpenMenuId] = useState(null);

  const toggleDropdown = id => {
    setOpenMenuId(prev => (prev === id ? null : id));
  };

  return (
    <div className={clsx(styles.mobileMenu, openMenu && styles.open)}>
      <nav className={styles.mainMenu}>
        {MENU_ITEMS.map(item => (
          <NavLink key={item.id} to={item.to}>
            {item.label}
          </NavLink>
        ))}
      </nav>
      <nav className={styles.secondMenu}>
        {SUBMENU_ITEMS.map(item => {
          const dropdownRef = useRef(null);

          const isOpen = openMenuId === item.id;

          return (
            <div key={item.id} className={styles.menuItem}>
              <Button
                className={clsx(styles.menuButton, isOpen && styles.open)}
                onClick={() => toggleDropdown(item.id)}
                variant="ghost"
                ariaLabel={item.label}
                >
                {item.label}
              </Button>

              <div
                ref={dropdownRef}
                className={clsx(styles.dropdown, isOpen && styles.open)}
                style={{
                  height: isOpen ? dropdownRef.current?.scrollHeight + 'px' : '0px',
                }}>
                {item.dropdown.map(link => (
                  <NavLink key={link.id} to={link.to} className={styles.dropdownLink}>
                    {link.label}
                  </NavLink>
                ))}
              </div>
            </div>
          );
        })}
      </nav>
    </div>
  );
};

export default MobileMenu;
