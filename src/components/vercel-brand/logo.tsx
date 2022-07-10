import { memo } from 'react';

export const VercelLogo = memo((props: { color: string }) => (
  <svg width="30" height="26" viewBox="0 0 1155 1000" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M577.344 0L1154.69 1000H0L577.344 0Z" fill={props.color} />
  </svg>
));

if (process.env.NODE_ENV !== 'production') {
  VercelLogo.displayName = 'VercelLogo';
}
