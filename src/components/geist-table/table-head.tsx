import { useTheme } from '@geist-ui/core';
import React, { cloneElement, useMemo } from 'react';
import type { TableAbstractColumn, TableDataItemBase } from './table-types';

interface Props<TableDataItem extends TableDataItemBase> {
  width: number
  columns: TableAbstractColumn<TableDataItem>[]
  className?: string
}

type NativeAttrs = Omit<React.HTMLAttributes<any>, keyof Props<any>>;
export type TableHeadProps<TableDataItem> = Props<TableDataItem> & NativeAttrs & {
  isSticky?: boolean
};

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

const THead = <TableDataItem extends TableDataItemBase>(
  props: {
    isSticky?: boolean,
    columns: TableAbstractColumn<TableDataItem>[]
  } & JSX.IntrinsicElements['thead']
) => {
  const theme = useTheme();
  const { isSticky, columns, ...rest } = props;

  return (
    <thead
      style={{
        position: isSticky ? 'fixed' : 'static',
        top: 64,
        zIndex: 1,
        clipPath: isSticky ? 'inset(0px 0px -100px)' : undefined,
        marginTop: 0
      }}
      {...rest}
    >
      <tr
        style={{
          transition: 'transition: box-shadow 0.15s ease 0s',
          boxShadow: isSticky ? '0 12px 12px -12px rgba(0,0,0,.08),38px 12px 12px -12px rgba(0,0,0,.08)' : undefined
        }}
      >
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
            padding: 8px 2px;
            align-items: center;
            min-height: calc(2 * var(--table-font-size));
            text-transform: uppercase;
          }
        `}</style>
    </thead>
  );
};

if (process.env.NODE_ENV !== 'production') {
  THead.displayName = 'TableHead.THead';
}

const TableHead = <TableDataItem extends TableDataItemBase>(
  props: TableHeadProps<TableDataItem>
) => {
  const { columns, width } = props as TableHeadProps<TableDataItem>;
  const isScalableWidth = useMemo(() => columns.find(item => !!item.width), [columns]);
  const colgroup = useMemo(() => {
    if (!isScalableWidth) return <colgroup />;
    return makeColgroup(width, columns);
  }, [isScalableWidth, width, columns]);

  const thead = useMemo(() => <THead columns={columns} isSticky={props.isSticky} />, [columns, props.isSticky]);
  const clonedTHead = useMemo(() => cloneElement<React.ComponentProps<typeof THead>>(thead, {
    style: {
      display: props.isSticky ? undefined : 'none',
      opacity: 0,
      pointerEvents: 'none'
    },
    isSticky: false
  }), [thead, props.isSticky]);

  return (
    <>
      {colgroup}
      {thead}
      {clonedTHead}
    </>
  );
};

if (process.env.NODE_ENV !== 'production') {
  TableHead.displayName = 'TableHead';
}

export default TableHead;
