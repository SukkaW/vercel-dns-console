import { useCallback, useMemo, useState } from 'react';

import { Checkbox, Popover, useTheme } from '@geist-ui/core';
import type { TableDataItemBase } from '../geist-table/table-types';
import type { TableColumnProps } from '../geist-table/table-column';
import { Table } from '../geist-table';

import MoreVertical from '@geist-ui/icons/moreVertical';

export interface DataTablesProp<TableDataItem extends TableDataItemBase> {
  data: TableDataItem[];
  columns: TableColumnProps<TableDataItem>[];
  className?: string;
  renderRowMenuItems?: (value: TableDataItem[keyof TableDataItem], rowData: TableDataItem, rowIndex: number) => React.ReactNode;
  overwriteRowActionItems?: (rowData: TableDataItem, rowIndex: number) => JSX.Element | void;
}

export const DataTables = <T extends TableDataItemBase>(props: DataTablesProp<T>) => {
  const theme = useTheme();

  const { renderRowMenuItems, overwriteRowActionItems } = props;

  const preRenderedOverWriteRowActionItems = useMemo(() => props.data.map(
    (rowData, rowIndex) => {
      const overwriteActionItem = overwriteRowActionItems?.(rowData, rowIndex);
      if (overwriteActionItem) {
        return overwriteActionItem;
      }
      return null;
    }
  ),
  [overwriteRowActionItems, props.data]);

  const initialCheckedRows = useMemo(
    () => preRenderedOverWriteRowActionItems
      .map(value => (value === null ? false : null)),
    [preRenderedOverWriteRowActionItems]
  );

  const [checkedRows, setCheckedRows] = useState<(null | boolean)[]>(initialCheckedRows.slice());

  if (initialCheckedRows.length !== checkedRows.length) {
    setCheckedRows(initialCheckedRows.slice());
  }

  const isAllChecked = useMemo(() => checkedRows.length > 0 && checkedRows.every(i => i === null || i === true), [checkedRows]);

  const handleCheckboxChange = useCallback(() => {
    setCheckedRows(initialCheckedRows.map(i => (i === null ? null : !isAllChecked)));
  }, [initialCheckedRows, isAllChecked]);

  const renderAction = (value: T[keyof T], rowData: T, rowIndex: number) => {
    const overwriteActionItem = preRenderedOverWriteRowActionItems[rowIndex];
    if (overwriteActionItem) {
      return overwriteActionItem;
    }
    return (
      <Checkbox checked={checkedRows[rowIndex] === true} onClick={() => {
        setCheckedRows(checkedRows => {
          const newCheckedRows = [...checkedRows];
          newCheckedRows[rowIndex] = !checkedRows[rowIndex];
          return newCheckedRows;
        });
      }} />
    );
  };

  const renderRowMenu = useCallback((value: T[keyof T], rowData: T, rowIndex: number) => (
    <Popover
      style={{ display: 'flex' }}
      placement="bottomEnd"
      content={(
        <div className="menu-content">
          {renderRowMenuItems?.(value, rowData, rowIndex)}
        </div>
      )}
    >
      <span>
        <MoreVertical className="record-menu-trigger" color={theme.palette.accents_3} size={16} />
      </span>
      <style jsx>{`
          span {
            cursor: pointer;
            display: inline-flex;
          }

          .menu-content {
            min-width: 100px
          }

          .menu-content :global(.item) {
            cursor: pointer;
          }

          .menu-content :global(.item:hover) {
            cursor: pointer;
            background: ${theme.palette.accents_1};
          }
          `}</style>
    </Popover>
  ), [renderRowMenuItems, theme.palette.accents_1, theme.palette.accents_3]);

  return (
    <Table className={props.className} data={props.data} stickyLastRow={true} hover={false}>
      <Table.Column
        prop="operation"
        label=""
        render={renderAction}
        width={30}
      >
        <Checkbox
          checked={isAllChecked}
          onChange={handleCheckboxChange}
        />
      </Table.Column>
      {
        props.columns.map((column, i) => (
          <Table.Column key={`${column.label ?? ''}${i}`} {...column} />
        ))
      }
      {
        useMemo(() => (
          <Table.Column
            prop="menu"
            label=""
            render={renderRowMenu}
            width={40}
          />
        ), [renderRowMenu])
      }
    </Table>
  );
};
