export const isBrowser = typeof window !== 'undefined';
export const noop = () => {
  /** no op */
};
export const formatDate = (ts: number): string => {
  const offset = (new Date()).getTimezoneOffset();
  const date = new Date(ts + offset * 60 * 1000);
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
};

export const clamp = (number: number, lower: number, upper: number) => {
  // simplest way to check NaN
  // eslint-disable-next-line no-self-compare
  if (number === number) {
    if (upper !== undefined) {
      number = number <= upper ? number : upper;
    }
    if (lower !== undefined) {
      number = number >= lower ? number : lower;
    }
  }
  return number;
};
