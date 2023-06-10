export const isBrowser = typeof window !== 'undefined';

export const formatDate = (ts: number): string => {
  const offset = (new Date()).getTimezoneOffset();
  const date = new Date(ts + offset * 60 * 1000);
  // eslint-disable-next-line @fluffyfox/no-unsafe-date -- always show local time
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
};

export const clamp = (number: number, lower: number, upper: number) => {
  // eslint-disable-next-line no-self-compare -- perf Number.isNaN
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
