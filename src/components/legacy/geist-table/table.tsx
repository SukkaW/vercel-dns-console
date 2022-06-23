import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import TableHead from './table-head';
import TableBody from './table-body';
import { TableContext, TableConfig } from './table-context';
import {
  TableAbstractColumn,
  TableDataItemBase,
  TableOnCellClick,
  TableOnChange,
  TableOnRowClick,
  TableRowClassNameHandler
} from './table-types';
import { type ScaleProps, useScale, withScale, useTheme } from '@geist-ui/core';
import TableColumn from './table-column';
import { isBrowser } from '@/lib/util';

interface Props<TableDataItem extends TableDataItemBase> {
  data?: Array<TableDataItem>
  initialData?: Array<TableDataItem>
  emptyText?: string
  hover?: boolean
  onRow?: TableOnRowClick<TableDataItem>
  onCell?: TableOnCellClick<TableDataItem>
  onChange?: TableOnChange<TableDataItem>
  className?: string
  rowClassName?: TableRowClassNameHandler<TableDataItem>
  stickyLastRow?: boolean
}

type NativeAttrs = Omit<React.TableHTMLAttributes<any>, keyof Props<any>>;
export type TableProps<TableDataItem extends TableDataItemBase> = Props<TableDataItem> & NativeAttrs;

function TableComponent<TableDataItem extends TableDataItemBase>(
  tableProps: React.PropsWithChildren<TableProps<TableDataItem>>
) {
  /* eslint-disable  @typescript-eslint/no-unused-vars */
  const {
    children,
    data: customData,
    initialData = [],
    hover = true,
    emptyText = '',
    onRow,
    onCell,
    onChange,
    className = '',
    rowClassName = () => '',
    stickyLastRow = false,
    ...props
  } = tableProps as React.PropsWithChildren<TableProps<TableDataItem>>;
  /* eslint-enable @typescript-eslint/no-unused-vars */
  const { SCALES } = useScale();
  const theme = useTheme();
  const ref = useRef<HTMLTableElement>(null);
  const [columns, setColumns] = useState<TableAbstractColumn<TableDataItem>[]>([]);
  const [data, setData] = useState<Array<TableDataItem>>(initialData);
  const updateColumn = useCallback((column: TableAbstractColumn<TableDataItem>) => {
    setColumns(last => {
      const hasColumn = last.find(item => item.prop === column.prop);
      if (!hasColumn) return [...last, column];
      return last.map(item => {
        if (item.prop !== column.prop) return item;
        return column;
      });
    });
  }, []);

  const contextValue = useMemo<TableConfig<TableDataItem>>(
    () => ({
      columns,
      updateColumn
    }),
    [columns, updateColumn]
  );

  useEffect(() => {
    if (typeof customData === 'undefined') return;
    setData(customData);
  }, [customData]);

  const [isSticky, setSticky] = useState(false);
  const theadElRef = useRef<HTMLDivElement>(null);
  const tbodyElRef = useRef<HTMLTableSectionElement>(null);

  const scrollHandler = useCallback(() => {
    const { top } = theadElRef.current?.getBoundingClientRect() || { top: 0 };
    const { bottom } = tbodyElRef.current?.getBoundingClientRect() || { bottom: 0 };

    if (top < 67 && bottom > 110) {
      setSticky(true);
    } else {
      setSticky(false);
    }
  }, []);

  useEffect(() => {
    if (isBrowser) {
      window.addEventListener('scroll', scrollHandler);
      return () => {
        window.removeEventListener('scroll', scrollHandler);
      };
    }
  }, [scrollHandler]);

  return (
    <>
      <div className="table-wrapper">
        <div className="scroll-overlay-container">
          <div className="scroller">
            <TableContext.Provider value={contextValue}>
              <div ref={theadElRef} />
              <table ref={ref} className={className} {...props}>
                <TableHead columns={columns} isSticky={isSticky} />
                <TableBody<TableDataItem>
                  data={data}
                  hover={hover}
                  emptyText={emptyText}
                  onRow={onRow}
                  onCell={onCell}
                  rowClassName={rowClassName}
                />
                {children}
              </table>
              <div ref={tbodyElRef} />
            </TableContext.Provider>
          </div>
        </div>
      </div>
      <style jsx>{`
          .table-wrapper {
            overflow-x: auto
          }
          .scroll-overlay-container: {
            overflow: hidden;
            position: relative;
            width: 100%;
            height: 100%;
          }
          .scroller {
            position: relative;
            overflow: auto;
            -webkit-overflow-scrolling: touch;
            scrollbar-width: none;
            width: 100%;
            height: 100%;
          }
          table {
            border-collapse: separate;
            border-spacing: 0;
            --table-font-size: ${SCALES.font(1)};
            font-size: var(--table-font-size);
            table-layout: fixed;
            width: ${SCALES.width(1, '100%')};
            height: ${SCALES.height(1, 'auto')};
            padding: ${SCALES.pt(0)} ${SCALES.pr(0)} ${SCALES.pb(0)} ${SCALES.pl(0)};
            margin: ${SCALES.mt(0)} ${SCALES.mr(0)} ${SCALES.mb(0)} ${SCALES.ml(0)};
          }

          table :global(th:last-of-type) {
            background: ${theme.palette.accents_1};
          }

          table :global(tr td:last-of-type) {
            position: sticky;
            right: 0;
            background: ${theme.palette.background}
          }
     `}</style>
    </>
  );
}

TableComponent.Column = TableColumn;
const Table = withScale(TableComponent) as any;
Table.Column = TableColumn;
export default Table as typeof TableComponent & ScaleProps;
