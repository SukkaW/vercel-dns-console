import { useState, useRef, useCallback, useEffect } from 'react';
import { isBrowser } from '../lib/util';
import { useConstHandler } from './use-const-handler';

export const useMenu = () => {
  const [isOpened, setIsOpened] = useState(false);

  const menuElRef = useRef<HTMLElement | null>(null);
  const triggerElRef = useRef<HTMLElement | null>(null);

  const handleClick = useConstHandler((e: MouseEvent) => {
    if (!isOpened) return;

    const target = e.target as HTMLElement;
    if (triggerElRef.current?.contains(target) || menuElRef.current?.contains(target)) return;

    e.stopPropagation();
    setIsOpened(false);
  });
  const handleScroll = useConstHandler(() => {
    if (!isOpened) return;
    setIsOpened(false);
  });

  const setMenuRef = useCallback((el: HTMLElement | null) => {
    menuElRef.current = el;
  }, []);
  const setTriggerRef = useCallback((el: HTMLElement | null) => {
    triggerElRef.current = el;
  }, []);

  useEffect(() => {
    if (isBrowser) {
      document.addEventListener('click', handleClick);
      window.addEventListener('scroll', handleScroll);
      return () => {
        document.removeEventListener('click', handleClick);
        window.removeEventListener('scroll', handleScroll);
      };
    }
  });

  return [isOpened, setIsOpened, setMenuRef, setTriggerRef] as const;
};
