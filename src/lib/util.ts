export const isBrowser = typeof window !== 'undefined';

export function formatDate(ts: number): string {
  const offset = (new Date()).getTimezoneOffset();
  const date = new Date(ts + offset * 60 * 1000);
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
}

// export const clamp = (number: number, lower: number | undefined, upper: number | undefined) => {
//   if (number === number) {
//     if (upper != null) {
//       number = number <= upper ? number : upper;
//     }
//     if (lower != null) {
//       number = number >= lower ? number : lower;
//     }
//   }
//   return number;
// };
