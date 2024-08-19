import '@/styles/app.css';

import { useEffect, useMemo } from 'react';

import { GeistProvider, CssBaseline } from '@geist-ui/core';

import type { AppProps } from 'next/app';
import type { NextPage } from 'next/types';

import { useMediaQuery } from '../hooks/use-media-query';
import { isBrowser } from '../lib/util';
import { atom, useAtom } from 'jotai';
import { ReadonlyModeProvider } from '../contexts/readonly-mode';

export type NextPageWithLayout<P = Record<string, unknown>> = NextPage<P> & {
  getLayout?: (page: React.ReactNode, props: P) => React.ReactNode
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout
};

export type Theme = 'light' | 'dark' | 'system';

const baseThemeAtom = atom<Theme>('system');
export const themeAtom = atom(
  (get) => get(baseThemeAtom),
  (_get, set, value: Theme) => {
    set(baseThemeAtom, value);
    if (isBrowser) {
      Promise.resolve().then(() => {
        if (value === 'system') {
          return localStorage.removeItem('theme');
        }
        return localStorage.setItem('theme', value);
      }).finally(() => {
        // ignore
      });
    }
  }
);

const App = ({ pageProps, Component }: AppPropsWithLayout) => {
  const isSystemThemeDark = useMediaQuery('(prefers-color-scheme: dark)');
  const [theme, setTheme] = useAtom(themeAtom);

  useEffect(() => {
    if (isBrowser) {
      const storedTheme = localStorage.getItem('theme');
      if (storedTheme === 'dark' || storedTheme === 'light') {
        setTheme(storedTheme);
      } else {
        // null or invalid value
        setTheme('system');
        if (storedTheme) {
          Promise.resolve().then(() => localStorage.removeItem('theme')).catch(() => { /** ignore */ });
        }
      }
    }
  }, [setTheme]);

  const geistThemeType = useMemo(() => {
    if (theme === 'system') {
      return isSystemThemeDark ? 'dark' : 'light';
    }
    return theme;
  }, [isSystemThemeDark, theme]);

  const getLayout = Component.getLayout || ((page) => page);

  return (
    <GeistProvider themeType={geistThemeType}>
      <ReadonlyModeProvider>
        <CssBaseline />
        {getLayout(<Component {...pageProps} />, pageProps)}
      </ReadonlyModeProvider>
    </GeistProvider>
  );
};

export default App;
