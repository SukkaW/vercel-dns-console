import { Checkbox, useScale, useTheme, withScale, type ScaleProps } from '@geist-ui/core';
import type { TableDataItemBase } from './types';
import { useTable, useSortBy, type Column, type CellProps } from 'react-table';
import { TableHead } from './table-head';
import { TableRow } from './table-row';
import { useCallback } from 'react';
import clsx from 'clsx';
import { useRowSelect } from './react-table-use-partial-selection';

import Lock from '@geist-ui/icons/lock';

export type DataTableColumns<T extends TableDataItemBase> = Column<T>;

export interface DataTableProps<T extends TableDataItemBase> {
  data: T[]
  columns: DataTableColumns<T>[]
}

declare module 'react-table' {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  export interface UseTableColumnOptions<D extends object> {
    cellClassName?: string;
    ellipsis?: boolean;
  }
}

const DataTable = <T extends TableDataItemBase>(props: DataTableProps<T>) => {
  const theme = useTheme();
  const { SCALES } = useScale();
  const { data, columns } = props;

  const {
    rowsById,
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow
  } = useTable(
    { columns, data },
    useSortBy,
    useRowSelect,
    useCallback((hooks) => {
      hooks.visibleColumns.push(columns => [
        {
          id: 'selection',
          // TODO: When use Pagination, change to toggleAllPageRowsSelected
          Header({ toggleAllRowsSelected, getToggleAllRowsSelectedProps }) {
            const props = getToggleAllRowsSelectedProps();
            return <Checkbox checked={props.checked} onChange={(e) => toggleAllRowsSelected(e.target.checked)} />;
          },
          // TODO: When use Pagination, change to toggleAllPageRowSelected
          Cell({ row }: CellProps<T, any>) {
            if (row.original.disableSelection) {
              return <Lock size={12} className="icon" />;
            }
            return <Checkbox size={12} className="icon" checked={row.isSelected} onChange={(e) => row.toggleRowSelected(e.target.checked)} />;
          },
          width: 40,
          maxWidth: 40,
          minWidth: 40
        },
        ...columns
      ]);
    }, [])
  );

  console.log(rowsById);

  return (
    <div className="table-wrapper">
      <div className="scroll-overlay-container">
        <div className="scroller">
          <table {...getTableProps()}>
            <TableHead headerGroup={headerGroups[0]} />
            <tbody {...getTableBodyProps()}>
              {rows.map((row, i) => {
                prepareRow(row);
                const rowProp = row.getRowProps();
                return (
                  <TableRow key={rowProp.key} rowProp={rowProp}>
                    {row.cells.map((cell) => {
                      const { key, ...restCellProp } = cell.getCellProps();
                      return (
                        <td key={key} {...restCellProp}>
                          <div
                            className={
                              clsx(
                                'cell',
                                cell.column.ellipsis && 'table-cell-ellipsis',
                                cell.column.cellClassName
                              )
                            }
                          >
                            {cell.render('Cell')}
                          </div>
                        </td>
                      );
                    })}
                  </TableRow>
                );
              })}
            </tbody>
          </table>
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
    </div>
  );
};

const withScaledDataTable = withScale(DataTable) as typeof DataTable & ScaleProps;
export { withScaledDataTable as DataTable };
