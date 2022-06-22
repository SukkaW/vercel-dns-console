import { useCallback, useMemo, useState } from 'react';

import { Checkbox, Popover, useTheme } from '@geist-ui/core';
import type { TableDataItemBase } from '../geist-table/table-types';
import type { TableColumnProps } from '../geist-table/table-column';
import { Table } from '../geist-table';

import MoreVertical from '@geist-ui/icons/moreVertical';

export interface DataTablesProp<TableDataItem extends TableDataItemBase> {
  data: TableDataItemBase[];
  columns: TableColumnProps<TableDataItem>[];
  className?: string;
  renderRowMenuItems?: (value: TableDataItem[keyof TableDataItem], rowData: TableDataItem, rowIndex: number) => React.ReactNode;
}

export const DataTables = <T extends TableDataItemBase>(props: DataTablesProp<T>) => {
  const [checkedRows, setCheckedRows] = useState<boolean[]>(new Array(props.data.length).fill(false));
  const theme = useTheme();

  if (props.data.length !== checkedRows.length) {
    setCheckedRows(new Array(props.data.length).fill(false));
  }

  const isAllChecked = useMemo(() => checkedRows.length > 0 && checkedRows.every(Boolean), [checkedRows]);

  const handleCheckboxChange = useCallback(() => {
    setCheckedRows(new Array(props.data.length).fill(!isAllChecked));
  }, [isAllChecked, props.data.length]);

  const renderAction = (value: T[keyof T], rowData: T, rowIndex: number) => (
    <Checkbox checked={checkedRows[rowIndex]} onClick={() => {
      setCheckedRows(checkedRows => {
        const newCheckedRows = [...checkedRows];
        newCheckedRows[rowIndex] = !checkedRows[rowIndex];
        return newCheckedRows;
      });
    }} />
  );

  const renderRowMenu = (value: T[keyof T], rowData: T, rowIndex: number) => (
    <Popover
      style={{ display: 'flex' }}
      placement="bottomEnd"
      content={(
        <div className="menu-content">
          {props.renderRowMenuItems?.(value, rowData, rowIndex)}
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
  );

  return (
    <Table className={props.className} data={props.data} sticky={true}>
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
      <Table.Column
        prop="menu"
        label=""
        render={renderRowMenu}
        width={40}
      />
    </Table>
  );
};
