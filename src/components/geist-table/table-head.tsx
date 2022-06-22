import { useTheme } from '@geist-ui/core';
import React, { useMemo } from 'react';
import { TableAbstractColumn, TableDataItemBase } from './table-types';

interface Props<TableDataItem extends TableDataItemBase> {
  width: number
  columns: Array<TableAbstractColumn<TableDataItem>>
  className?: string
}

type NativeAttrs = Omit<React.HTMLAttributes<any>, keyof Props<any>>;
export type TableHeadProps<TableDataItem> = Props<TableDataItem> & NativeAttrs;

// eslint-disable-next-line @typescript-eslint/comma-dangle
const makeColgroup = <TableDataItem,>(
  width: number,
  columns: Array<TableAbstractColumn<TableDataItem>>
) => {
  const unsetWidthCount = columns.filter(c => !c.width).length;
  const customWidthTotal = columns.reduce((pre, current) => {
    return current.width ? pre + current.width : pre;
  }, 0);
  const averageWidth = (width - customWidthTotal) / unsetWidthCount;
  if (averageWidth <= 0) return <colgroup />;
  return (
    <colgroup>
      {columns.map((column, index) => (
        <col key={`colgroup-${index}`} style={{ width: column.width || averageWidth }} />
      ))}
    </colgroup>
  );
};

const TableHead = <TableDataItem extends TableDataItemBase>(
  props: TableHeadProps<TableDataItem>
) => {
  const theme = useTheme();
  const { columns, width } = props as TableHeadProps<TableDataItem>;
  const isScalableWidth = useMemo(() => columns.find(item => !!item.width), [columns]);
  const colgroup = useMemo(() => {
    if (!isScalableWidth) return <colgroup />;
    return makeColgroup(width, columns);
  }, [isScalableWidth, width, columns]);

  return (
    <>
      {colgroup}
      <thead>
        <tr>
          {columns.map((column, index) => (
            <th
              key={`table-th-${String(column.prop)}-${index}`}
              className={column.className}
              style={{
                width: column.width,
                minWidth: column.width,
                maxWidth: column.width
              }}
            >
              <div className="thead-box">{column.label}</div>
            </th>
          ))}
        </tr>
      </thead>
      <style jsx>{`
        thead {
          border-collapse: separate;
          border-spacing: 0;
          font-size: inherit;
        }

        th {
          position: relative;
          padding: 0 0.5em;
          font-size: calc(0.75 * var(--table-font-size));
          font-weight: normal;
          text-align: left;
          letter-spacing: 0;
          vertical-align: middle;
          line-height: 24px;
          min-height: calc(1.25 * var(--table-font-size));
          color: ${theme.palette.accents_5};
          background: ${theme.palette.accents_1};
          border-bottom: 1px solid ${theme.palette.border};
          border-top: 1px solid ${theme.palette.border};
          border-radius: 0;
        }

        th:nth-child(1) {
          border-bottom: 1px solid ${theme.palette.border};
          border-left: 1px solid ${theme.palette.border};
          border-top: 1px solid ${theme.palette.border};
          border-top-left-radius: ${theme.layout.radius};
          border-bottom-left-radius: ${theme.layout.radius};
        }

        th:last-child {
          border-bottom: 1px solid ${theme.palette.border};
          border-right: 1px solid ${theme.palette.border};
          border-top: 1px solid ${theme.palette.border};
          border-top-right-radius: ${theme.layout.radius};
          border-bottom-right-radius: ${theme.layout.radius};
        }

        .thead-box {
          display: flex;
          padding: 8px 6px;
          align-items: center;
          min-height: calc(2 * var(--table-font-size));
          text-transform: uppercase;
        }
      `}</style>
    </>
  );
};

export default TableHead;
