import styles from './SearchBar.module.scss';
import CloseIcon from './../../../assets/icons/close-icon.svg';
import Container from '../../common/Container/Container';
import clsx from 'clsx';

const SearchBar = ({ openSearchBar, onClose }) => {
  return (
    <div className={clsx(styles.searchBar, openSearchBar && styles.open)}>
      <Container className={styles.inner}>
        <CloseIcon onClick={onClose}/>
        <div className={styles.searchWrapper}>
          <input type="text" placeholder="Найти..." />
        </div>
      </Container>
    </div>
  );
};

export default SearchBar;
