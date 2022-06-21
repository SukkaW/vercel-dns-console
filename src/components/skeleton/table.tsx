import { Table } from '@geist-ui/core';
import { memo } from 'react';

const EMPTY_DATA = new Array(5).fill({});

export const DataTable = memo(() => {
  // const theme = useTheme();
  return (
    <Table data={EMPTY_DATA}>
      <Table.Column prop="" label="" />
    </Table>
  );
});

if (process.env.NODE_ENV !== 'production') {
  DataTable.displayName = 'Skeleton.DataTable';
}
