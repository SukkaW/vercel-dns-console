import { Checkbox, Pagination, Select, Spacer, useScale, useTheme, withScale, type ScaleProps } from '@geist-ui/core';
import type { TableDataItemBase } from './types';
import {
  useTable,
  useSortBy,
  usePagination,
  useFilters,
  useGlobalFilter,
  type Column, type CellProps, type TableOptions, type IdType, type Filters
} from 'react-table';
import { TableHead } from './table-head';
import { TableRow } from './table-row';
import { useCallback, useMemo } from 'react';
import clsx from 'clsx';
import { useRowSelect } from './react-table-use-partial-selection';

import Lock from '@geist-ui/icons/lock';
import ChevronRight from '@geist-ui/icons/chevronRight';
import ChevronLeft from '@geist-ui/icons/chevronLeft';
import { TablePlaceHolder } from './placeholder';

export type DataTableColumns<T extends TableDataItemBase> = Column<T>;

interface DataTableFilterRendererArgs<T extends TableDataItemBase> {
  setFilter: (columnId: IdType<T>, updater: any) => void,
  setGlobalFilter: (updater: string) => void,
  filters: Filters<T>
}

export type DataTableFilterRenderer<T extends TableDataItemBase> = (arg: DataTableFilterRendererArgs<T>) => React.JSX.Element;

export interface DataTableProps<T extends TableDataItemBase> {
  data: T[],
  columns: Array<DataTableColumns<T>>,
  tableOptions?: Omit<TableOptions<T>, 'data' | 'columns'>,
  renderRowAction?: (row: T) => React.JSX.Element,
  renderHeaderAction?: (selected: T[]) => React.JSX.Element,
  renderFilter?: DataTableFilterRenderer<T>,
  placeHolder?: boolean | number
}

declare module 'react-table' {

  // eslint-disable-next-line unused-imports/no-unused-vars -- fuck interface merging
  export interface UseTableColumnOptions<D extends object> {
    headerClassName?: string,
    cellClassName?: string,
    ellipsis?: boolean
  }
}

const DataTable = <T extends TableDataItemBase>({
  data,
  columns,
  tableOptions,
  renderRowAction,
  renderHeaderAction,
  renderFilter,
  placeHolder
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
    pageCount,
    gotoPage,
    setPageSize,
    state: { pageIndex, pageSize, filters },
    // filter
    setFilter,
    setGlobalFilter
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
    useFilters,
    useGlobalFilter,
    useSortBy,
    usePagination,
    useRowSelect,
    useCallback((hooks) => {
      hooks.visibleColumns.push(columns => [
        {
          id: 'selection',
          // eslint-disable-next-line @eslint-react/no-nested-components -- react-tables
          Header({ toggleAllPageRowsSelected, getToggleAllRowsSelectedProps }) {
            const props = getToggleAllRowsSelectedProps();
            return <Checkbox checked={props.checked} onChange={(e) => toggleAllPageRowsSelected(e.target.checked)} />;
          },
          // eslint-disable-next-line @eslint-react/no-nested-components -- react-tables
          Cell({ row }: CellProps<T>) {
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
        hooks.visibleColumns.push(columns => {
          return [
            ...columns,
            {
              id: 'action',
              Header({ selectedFlatRows }) {
                if (renderHeaderAction) {
                  return renderHeaderAction(selectedFlatRows.map(row => row.original));
                }
                return null;
              },
              Cell({ row }: CellProps<T>) {
                return renderRowAction(row.original);
              },
              width: 40,
              maxWidth: 40,
              minWidth: 40,
              headerClassName: 'action-header',
              cellClassName: 'action-cell'
            }
          ];
        });
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

  const filterUIElements = useMemo(
    () => renderFilter?.({
      setFilter, setGlobalFilter, filters
    }),
    [filters, renderFilter, setFilter, setGlobalFilter]
  );

  return (
    <>
      {filterUIElements}
      {filterUIElements && <Spacer />}
      <div className="table-wrapper">
        <table {...getTableProps()}>
          <TableHead headerGroup={headerGroups[0]} />
          <tbody {...getTableBodyProps()}>
            {
              page.map((row) => {
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
              })
            }
          </tbody>
        </table>
        {
          placeHolder && (
            <TablePlaceHolder rowCount={typeof placeHolder === 'number' ? placeHolder : 3} />
          )
        }
      </div>
      <div className="pagination-wrapper">
        {
          useMemo(() => (
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
          ), [handlePaginationChange, pageCount, pageIndex])
        }
        <div className="select-wrapper">
          Show
          {
            useMemo(() => (
              <Select value={String(pageSize)} mx={1 / 2} scale={2 / 3} onChange={handleSelectPageSizeChange}>
                <Select.Option value="10">10</Select.Option>
                <Select.Option value="15">15</Select.Option>
                <Select.Option value="20">20</Select.Option>
                <Select.Option value="50">50</Select.Option>
                <Select.Option value="100">100</Select.Option>
              </Select>
            ), [handleSelectPageSizeChange, pageSize])
          }
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

        table :global(.action-cell) {
          justify-content: flex-end;
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
          width: ${SCALES.width(1, '75px')};
          min-width: ${SCALES.width(1, '75px')};
        }
     `}</style>
    </>
  );
};

const withScaledDataTable = withScale(DataTable) as typeof DataTable & ScaleProps;

export { withScaledDataTable as DataTable };
