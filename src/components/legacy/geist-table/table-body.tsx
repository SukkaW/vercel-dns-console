import type React from 'react';
import TableCell from './table-cell';
import { useTableContext } from './table-context';
import {
  TableDataItemBase,
  TableOnCellClick,
  TableOnRowClick,
  TableRowClassNameHandler
} from './table-types';
import { useTheme } from '@geist-ui/core';
import clsx from 'clsx';
import { useCallback, useMemo } from 'react';
import { useConstHandler } from '../../../hooks/use-const-handler';
import { noop } from '../../../lib/util';

interface Props<TableDataItem extends TableDataItemBase> {
  hover: boolean
  emptyText: string
  onRow?: TableOnRowClick<TableDataItem>
  onCell?: TableOnCellClick<TableDataItem>
  data: Array<TableDataItem>
  className?: string
  rowClassName: TableRowClassNameHandler<TableDataItem>
}

type NativeAttrs = Omit<React.HTMLAttributes<any>, keyof Props<any>>;
export type TableBodyProps<TableDataItem> = Props<TableDataItem> & NativeAttrs;

const TableBody = <TableDataItem extends TableDataItemBase>({
  data,
  hover,
  emptyText,
  onRow: origOnRow = noop,
  onCell: origOnCell = noop,
  rowClassName: origRowClassName
}: TableBodyProps<TableDataItem>) => {
  const theme = useTheme();
  const { columns } = useTableContext<TableDataItem>();
  const onRow = useConstHandler(origOnRow);

  const rowClickHandler = useCallback((row: TableDataItem, index: number) => {
    onRow?.(row, index);
  }, [onRow]);
  const rowClassName = useConstHandler(origRowClassName);
  const onCell = useConstHandler(origOnCell);

  const trElements = useMemo(() => (
    <>
      {data.map((row, index) => {
        const className = rowClassName(row, index);
        return (
          <tr
            key={`tbody-row-${index}`}
            className={clsx({ hover }, className)}
            onClick={() => rowClickHandler(row, index)}>
            <TableCell<TableDataItem>
              columns={columns}
              row={row}
              rowIndex={index}
              emptyText={emptyText}
              onCellClick={onCell}
            />
          </tr>
        );
      })}
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
  ), [columns, data, emptyText, hover, onCell, rowClassName, rowClickHandler, theme.palette.accents_1, theme.palette.accents_6, theme.palette.border]);

  return (
    <tbody>
      {trElements}
    </tbody>
  );
};

if (process.env.NODE_ENV !== 'production') {
  TableBody.displayName = 'TableBody';
}

export default TableBody;
