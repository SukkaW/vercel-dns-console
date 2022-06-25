import { useTheme } from '@geist-ui/core';
import { memo } from 'react';

export const TablePlaceHolder = memo((props: { rowCount: number }) => {
  const theme = useTheme();
  const { rowCount } = props;

  return (
    <div aria-hidden>
      <style jsx>{`
        div {
          background: repeating-linear-gradient(transparent, transparent 43px, ${theme.palette.accents_2} 43px, ${theme.palette.accents_2} 44px);
          position: relative;
          width: 100%;
          height: calc(${rowCount} * 44px);
        }
      `}</style>
    </div>
  );
});

if (process.env.NODE_ENV !== 'production') {
  TablePlaceHolder.displayName = 'TablePlaceHolder';
}
