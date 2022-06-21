import { Checkbox, Table } from '@geist-ui/core';
import type { TableDataItemBase } from '@geist-ui/core/dist/table/table-types';
import type { TableColumnProps } from '@geist-ui/core/dist/table/table-column';
import { useCallback, useMemo, useState } from 'react';

export interface DataTablesProp<TableDataItem extends TableDataItemBase> {
  data: TableDataItemBase[];
  columns: TableColumnProps<TableDataItem>[];
}

export const DataTables = <T extends TableDataItemBase>(props: DataTablesProp<T>) => {
  const [checkedRows, setCheckedRows] = useState<boolean[]>(new Array(props.data.length).fill(false));
  const isAllChecked = useMemo(() => checkedRows.every(Boolean), [checkedRows]);

  const handleCheckboxChange = useCallback(() => {
    setCheckedRows(new Array(props.data.length).fill(!isAllChecked));
  }, [isAllChecked, props.data.length]);

  const renderAction = (value: TableDataItemBase[keyof TableDataItemBase], rowData: TableDataItemBase, rowIndex: number) => (
    <Checkbox checked={checkedRows[rowIndex]} onClick={() => {
      setCheckedRows(checkedRows => {
        const newCheckedRows = [...checkedRows];
        newCheckedRows[rowIndex] = !checkedRows[rowIndex];
        return newCheckedRows;
      });
    }} />
  );

  return (
    <Table data={props.data}>
      <Table.Column
        prop="operation"
        label=""
        render={renderAction}
        width={22}
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
    </Table>
  );
};
