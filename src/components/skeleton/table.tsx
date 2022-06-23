import { Table } from '@/components/legacy/geist-table';
import { memo } from 'react';

const EMPTY_DATA = new Array(5).fill({});

export const DataTable = memo(() => {
  // const theme = useTheme();
  return (
    <Table data={EMPTY_DATA}>
      <Table.Column prop="any" label="" />
    </Table>
  );
});

if (process.env.NODE_ENV !== 'production') {
  DataTable.displayName = 'Skeleton.DataTable';
}
