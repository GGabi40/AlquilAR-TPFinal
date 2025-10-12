import React, {useEffect} from 'react'
import { useLocation } from  'react-router';

export const useScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth'});
  }, [pathname]);
}

export const ScrollToTop = () => {
  useScrollToTop();
  return null;
};