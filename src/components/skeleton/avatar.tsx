import { useTheme } from '@geist-ui/core';
import { memo } from 'react';

export const Avatar = memo((props: JSX.IntrinsicElements['div']) => {
  const theme = useTheme();

  return (
    <div className="skeleton skeleton.avatar" {...props}>
      <style jsx>{`
      div {
        width: 36px;
        height: 36px;
        border-radius: 50%;
        background-image: linear-gradient(
          270deg,
          ${theme.palette.accents_1},
          ${theme.palette.accents_2},
          ${theme.palette.accents_2},
          ${theme.palette.accents_1}
        );
        background-size: 400% 100%;
        animation: loading 3s ease-in-out infinite;
        opacity: 0.5;
        transition: opacity 300ms ease-out;
      }
      @keyframes loading {
        0% {
          background-position: 200% 0;
        }
        to {
          background-position: -200% 0;
        }
      }
    `}</style>
    </div>
  );
});

if (process.env.NODE_ENV !== 'production') {
  Avatar.displayName = 'Skeleton.Avatar';
}
