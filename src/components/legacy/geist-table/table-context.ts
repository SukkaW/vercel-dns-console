import { useContext, createContext } from 'react';
import { noop } from '../../../lib/util';
import { TableAbstractColumn } from './table-types';

export interface TableConfig<T> {
  columns: Array<TableAbstractColumn<T>>
  updateColumn: (column: TableAbstractColumn<T>) => void
}

const defaultContext = {
  columns: [],
  updateColumn: noop
};

export const TableContext = createContext<TableConfig<any>>(defaultContext);

export const useTableContext = <T>(): TableConfig<T> => useContext<TableConfig<T>>(TableContext);
