import { useLocalStorage, useSetLocalStorage } from 'foxact/use-local-storage';

export type Theme = 'light' | 'dark' | 'system';

export const useTheme = () => useLocalStorage<Theme>('theme', 'system');
export const useSetTheme = () => useSetLocalStorage<Theme>('theme', JSON.stringify);
