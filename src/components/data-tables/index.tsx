import { Checkbox, Pagination, Select, useScale, useTheme, withScale, type ScaleProps } from '@geist-ui/core';
import type { TableDataItemBase } from './types';
import { useTable, useSortBy, usePagination, type Column, type CellProps, TableOptions } from 'react-table';
import { TableHead } from './table-head';
import { TableRow } from './table-row';
import { useCallback } from 'react';
import clsx from 'clsx';
import { useRowSelect } from './react-table-use-partial-selection';

import Lock from '@geist-ui/icons/lock';
import ChevronRight from '@geist-ui/icons/chevronRight';
import ChevronLeft from '@geist-ui/icons/chevronLeft';

export type DataTableColumns<T extends TableDataItemBase> = Column<T>;

export interface DataTableProps<T extends TableDataItemBase> {
  data: T[]
  columns: DataTableColumns<T>[],
  tableOptions?: Omit<TableOptions<T>, 'data' | 'columns'>,
  renderRowAction?: (row: T) => JSX.Element,
  renderHeaderAction?: (selected: T[]) => JSX.Element,
  children?: React.ReactNode
}

declare module 'react-table' {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  export interface UseTableColumnOptions<D extends object> {
    cellClassName?: string;
    ellipsis?: boolean;
  }
}

const DataTable = <T extends TableDataItemBase>({
  data,
  columns,
  tableOptions,
  renderRowAction,
  renderHeaderAction,
  children
}: DataTableProps<T>) => {
  const theme = useTheme();
  const { SCALES } = useScale();

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    // Provided by usePagination hook
    page, // only contains rows from the current page
    // pageOptions,
    pageCount,
    gotoPage,
    setPageSize,
    state: { pageIndex, pageSize }
  } = useTable(
    {
      columns,
      data,
      ...tableOptions,
      initialState: {
        pageSize: 15,
        ...tableOptions?.initialState
      }
    },
    useSortBy,
    usePagination,
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

      if (renderRowAction) {
        hooks.visibleColumns.push(columns => [
          ...columns,
          {
            id: 'action',
            Header({ selectedFlatRows }) {
              if (renderHeaderAction) {
                return renderHeaderAction(selectedFlatRows.map(row => row.original));
              }
              return null;
            },
            Cell({ row }: CellProps<T, any>) {
              return renderRowAction(row.original);
            },
            width: 40,
            maxWidth: 40,
            minWidth: 40
          }
        ]);
      }

    }, [renderHeaderAction, renderRowAction])
  );

  const handlePaginationChange = useCallback((page: number) => {
    gotoPage(page - 1);
  }, [gotoPage]);

  const handleSelectPageSizeChange = useCallback((pageSize: string | string[]) => {
    if (typeof pageSize === 'string') {
      const number = Number.parseInt(pageSize, 10);
      if (Number.isNaN(number)) {
        return;
      }
      setPageSize(number);
    }
  }, [setPageSize]);

  return (
    <>
      <div className="table-wrapper">
        <table {...getTableProps()}>
          <TableHead headerGroup={headerGroups[0]} />
          <tbody {...getTableBodyProps()}>
            {page.map((row, i) => {
              prepareRow(row);
              const rowProp = row.getRowProps();
              return (
                <TableRow key={rowProp.key} rowProp={rowProp}>
                  {row.cells.map((cell) => {
                    const { key, ...restCellProp } = cell.getCellProps();
                    return (
                      <td key={key} {...restCellProp}>
                        <div
                          className={clsx(
                            'cell',
                            cell.column.ellipsis && 'table-cell-ellipsis',
                            cell.column.cellClassName
                          )}
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
      <div className="pagination-wrapper">
        {
          pageCount > 1
            ? (
              <Pagination
                count={pageCount}
                page={pageIndex + 1}
                initialPage={pageIndex}
                onChange={handlePaginationChange}
              >
                <Pagination.Next><ChevronRight /></Pagination.Next>
                <Pagination.Previous><ChevronLeft /></Pagination.Previous>
              </Pagination>
            )
            : <div />
        }
        <div className="select-wrapper">
          Show
          <Select value={String(pageSize)} mx={1 / 2} scale={2 / 3} w="55px" onChange={handleSelectPageSizeChange}>
            <Select.Option value="10">10</Select.Option>
            <Select.Option value="15">15</Select.Option>
            <Select.Option value="20">20</Select.Option>
            <Select.Option value="50">50</Select.Option>
            <Select.Option value="100">100</Select.Option>
          </Select>
          per page
        </div>
      </div>

      <style jsx>{`
        .table-wrapper {
           overflow-x: auto;
           max-height: calc(100vh - 250px);
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
          position: sticky;
          right: 0;
          background: ${theme.palette.accents_1};
          z-index: 2;
        }

        table :global(tr td:last-of-type) {
          position: sticky;
          right: 0;
          background: ${theme.palette.background}
        }

        tbody {
          z-index: 1;
        }

        .pagination-wrapper {
          display: block;
          margin: ${SCALES.mt(1)} ${SCALES.mr(1, 'auto')} ${SCALES.mb(1)} ${SCALES.ml(1, 'auto')};
          text-align: center;
        }

        @media (min-width: ${theme.breakpoints.sm.min}) {
          .pagination-wrapper {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
          }
        }

        .select-wrapper {
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: ${SCALES.font(4 / 5)};
          padding: ${SCALES.pt(0)} ${SCALES.pr(1)} ${SCALES.pb(0)} ${SCALES.pl(1)};
        }

        .select-wrapper :global(.select) {
          min-width: ${SCALES.width(1, '50px')};
        }
     `}</style>
    </>
  );
};

const withScaledDataTable = withScale(DataTable) as typeof DataTable & ScaleProps;
export { withScaledDataTable as DataTable };
