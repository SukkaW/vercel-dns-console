export const isBrowser = typeof window !== 'undefined';
export const noop = () => {
  /** no op */
};
export const formatDate = (ts: number): string => {
  const offset = (new Date()).getTimezoneOffset();
  const date = new Date(ts + offset * 60 * 1000);
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
};
