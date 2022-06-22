/* eslint-disable no-nested-ternary */
import { useCallback, useEffect, useRef, useState } from 'react';
import { useConstHandler } from '@/hooks/use-const-handler';

export const useResize = (callback: () => unknown, immediatelyInvoke = true): void => {
  const memoizedCallback = useConstHandler(callback);
  const immediatelyInvokeRef = useRef(immediatelyInvoke);

  useEffect(() => {
    const fn = () => memoizedCallback();
    if (immediatelyInvokeRef.current) {
      fn();
    }
    window.addEventListener('resize', fn);
    return () => window.removeEventListener('resize', fn);
  }, [memoizedCallback]);
};

export type ShapeType = {
  width: number
  height: number
};

export const getRealShape = (el: HTMLElement | null): ShapeType => {
  const defaultShape: ShapeType = { width: 0, height: 0 };
  if (!el || typeof window === 'undefined') return defaultShape;

  const rect = el.getBoundingClientRect();
  const { width, height } = window.getComputedStyle(el);

  const getCSSStyleVal = (str: string, parentNum: number) => {
    if (!str) return 0;
    const strVal = str.includes('px')
      ? +str.split('px')[0]
      : str.includes('%')
        ? +str.split('%')[0] * parentNum * 0.01
        : str;

    return Number.isNaN(+strVal) ? 0 : +strVal;
  };

  return {
    width: getCSSStyleVal(`${width}`, rect.width),
    height: getCSSStyleVal(`${height}`, rect.height)
  };
};

export type ShapeResult = [ShapeType, () => void];

export const useRealShape = (
  el: HTMLElement | null
): ShapeResult => {
  const [state, setState] = useState<ShapeType>({
    width: 0,
    height: 0
  });
  const update = useCallback(() => {
    const { width, height } = getRealShape(el);
    setState({ width, height });
  }, [el]);
  useEffect(() => update(), [update]);

  return [state, update];
};
