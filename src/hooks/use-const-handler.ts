import { useCallback, useRef } from 'react';
import { useIsomorphicLayoutEffect as useLayoutEffect } from './use-isomorphic-layout-effect';

export const useConstHandler = <Args extends any[], Result>(handler: (...args: Args) => Result): typeof handler => {
  const handlerRef = useRef(handler);
  useLayoutEffect(() => {
    handlerRef.current = handler;
  });

  return useCallback((...args: Args) => handlerRef.current(...args), []);
};
