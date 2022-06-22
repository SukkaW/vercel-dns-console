import React, { useEffect, useMemo } from 'react';
import { noop } from '@/lib/util';
import { useTableContext } from './table-context';
import { TableColumnRender, TableDataItemBase } from './table-types';

export type TableColumnProps<TableDataItem> = {
  prop: keyof TableDataItem
  label?: string
  width?: number
  className?: string
  render?: TableColumnRender<TableDataItem>
};

const TableColumn = <TableDataItem extends TableDataItemBase>(
  columnProps: React.PropsWithChildren<TableColumnProps<TableDataItem>>
) => {
  const {
    children,
    prop,
    label,
    width,
    className,
    render: renderHandler
  } = columnProps as React.PropsWithChildren<TableColumnProps<TableDataItem>>;
  const { updateColumn } = useTableContext<TableDataItem>();
  const safeProp = useMemo(() => String(prop).trim(), [prop]);

  useEffect(() => {
    updateColumn({
      label: children || label,
      prop: safeProp,
      width,
      className: className ?? '',
      renderHandler: renderHandler ?? noop
    });
  }, [children, label, safeProp, width, className, renderHandler, updateColumn]);

  return null;
};

export default TableColumn;
