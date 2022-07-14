import { isBrowser } from '@/lib/util';
import { LOCALSTORAGE_VERCEL_API_TOKEN_KEY } from '../lib/constant';
import { atom, useAtom } from 'jotai';

const baseTokenAtom = atom(
  isBrowser
    ? localStorage.getItem(LOCALSTORAGE_VERCEL_API_TOKEN_KEY)
    : null
);

const tokenAtom = atom(
  (get) => get(baseTokenAtom),
  (get, set, token: string | null) => {
    set(baseTokenAtom, token);
    if (isBrowser) {
      Promise.resolve().then(() => {
        if (token) {
          localStorage.setItem(LOCALSTORAGE_VERCEL_API_TOKEN_KEY, token);
        } else {
          localStorage.removeItem(LOCALSTORAGE_VERCEL_API_TOKEN_KEY);
        }
      });
    }
  }
);

export const useVercelApiToken = () => useAtom(tokenAtom);
