import { useTheme } from '@geist-ui/core';
import type { RowPropGetter } from 'react-table';
import { TableDataItemBase } from './types';

export interface TableRowProps<T extends TableDataItemBase> {
  rowProp?: RowPropGetter<T>,
  children?: React.ReactNode,
}

export const TableRow = <T extends TableDataItemBase>({
  rowProp,
  children
}: TableRowProps<T>) => {
  const theme = useTheme();

  return (
    <>
      <tr {...rowProp}>
        {children}
      </tr>
      <style jsx>{`
        tr {
          transition: background-color 0.25s ease;
          font-size: inherit;
        }
        tr.hover:hover {
          background-color: ${theme.palette.accents_1};
        }
        tr :global(td) {
          border-bottom: 1px solid ${theme.palette.border};
          color: ${theme.palette.accents_6};
          font-size: calc(0.875 * var(--table-font-size));
          text-align: left;
        }
        tr :global(.cell) {
          display: flex;
          align-items: center;
          padding: 8px;
          vertical-align: middle;
          color: ${theme.palette.accents_6};
          line-height: 24px;
          min-height: 40px;
        }
      `}</style>
    </>
  );
};
