import { createContext, useCallback, useContext, useEffect, useReducer } from 'react';

/* ---------------- INITIAL STATE ---------------- */

const initialState = {
  mobileMenu: {
    isOpen: false,
  },
  searchBar: {
    isActive: false,
  },
};

/* ---------------- ACTIONS ---------------- */

const ACTIONS = {
  TOGGLE_MOBILE_MENU: 'TOGGLE_MOBILE_MENU',
  OPEN_SEARCH_BAR: 'OPEN_SEARCH_BAR',
  CLOSE_SEARCH_BAR: 'CLOSE_SEARCH_BAR',
};

/* ---------------- REDUCER ---------------- */

const appReducer = (state, action) => {
  switch (action.type) {
    case ACTIONS.TOGGLE_MOBILE_MENU:
      return {
        ...state,
        mobileMenu: {
          ...state.mobileMenu,
          isOpen: !state.mobileMenu.isOpen,
        },
      };

    case ACTIONS.OPEN_SEARCH_BAR:
      return {
        ...state,
        searchBar: {
          ...state.searchBar,
          isActive: true,
        },
        mobileMenu: {
          ...state.mobileMenu,
          isOpen: false,
        },
      };

    case ACTIONS.CLOSE_SEARCH_BAR:
      return {
        ...state,
        searchBar: {
          ...state.searchBar,
          isActive: false,
        },
      };

    default:
      return state;
  }
};

/* ---------------- SCROLL LOCK HELPERS ---------------- */

const isDesktop = () => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(pointer: fine)').matches;
};

const getScrollbarWidth = () => {
  if (typeof window === 'undefined') return 0;
  return window.innerWidth - document.documentElement.clientWidth;
};

const lockScroll = () => {
  if (typeof window === 'undefined') return;

  const scrollbarWidth = getScrollbarWidth();

  document.documentElement.classList.add('lock');
  document.body.classList.add('lock');

  if (isDesktop()) {
    document.body.style.paddingRight = `${scrollbarWidth}px`;
  }
};

const unlockScroll = () => {
  if (typeof window === 'undefined') return;

  document.documentElement.classList.remove('lock');
  document.body.classList.remove('lock');
  document.body.style.paddingRight = '';
};

/* ---------------- CONTEXT ---------------- */

const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  useEffect(() => {
    const shouldLock = state.mobileMenu.isOpen || state.searchBar.isActive;

    if (shouldLock) lockScroll();
    else unlockScroll();
  }, [state.mobileMenu.isOpen, state.searchBar.isActive]);

  const toggleMenu = useCallback(() => {
    dispatch({ type: ACTIONS.TOGGLE_MOBILE_MENU });
  }, []);

  const openSearchBar = useCallback(() => {
    dispatch({ type: ACTIONS.OPEN_SEARCH_BAR });
  }, []);

  const closeSearchBar = useCallback(() => {
    dispatch({ type: ACTIONS.CLOSE_SEARCH_BAR });
  }, []);

  const value = {
    state,
    toggleMenu,
    openSearchBar,
    closeSearchBar,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

/* ---------------- HOOKS ---------------- */

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within AppProvider');
  }
  return context;
};

export const useMobileMenu = () => {
  const { toggleMenu, state } = useAppContext();
  return {
    toggleMenu,
    isOpen: state.mobileMenu.isOpen,
  };
};

export const useSearchBar = () => {
  const { openSearchBar, closeSearchBar, state } = useAppContext();
  return {
    openSearchBar,
    closeSearchBar,
    isActive: state.searchBar.isActive,
  };
};
