export type TableDataItemBase = {
  disableSelection?: boolean;
} & {
  [k: string]: any
};

export interface TableAbstractColumn<TableDataItem> {
  prop: keyof TableDataItem
  label: React.ReactNode | string
  className: string
  width?: number
}
