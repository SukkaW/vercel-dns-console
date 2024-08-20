import { LOCALSTORAGE_VERCEL_API_TOKEN_KEY } from '../lib/constant';
import { useLocalStorage } from 'foxact/use-local-storage';

export const useVercelApiToken = () => useLocalStorage(LOCALSTORAGE_VERCEL_API_TOKEN_KEY, null, { raw: true });
