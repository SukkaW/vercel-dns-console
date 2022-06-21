import { useMemo } from 'react';

import { DataTables } from '../data-tables';
import { Skeleton } from '../skeleton';

import { useVercelListDNSRecords } from '@/hooks/use-vercel-dns';
import { type TableColumnProps } from '@geist-ui/core';

interface RecordTableItem {
  name: string;
  priority?: number,
  type: string,
  value: string,
  action: null
}

interface RecordItem {
  id: string,
  slug: string,
  name: string,
  createdAt: number | null,
  updatedAt: number | null,
  data: RecordTableItem
}

const recordDataTableColumns: TableColumnProps<RecordTableItem>[] = [
  {
    prop: 'name',
    label: 'Name'
  },
  {
    prop: 'type',
    label: 'Type'
  },
  {
    prop: 'priority',
    label: 'Priority'
  },
  {
    prop: 'value',
    label: 'Value'
  }
  // {
  //   prop: 'action',
  //   render
  // }
];

export const DNSDataTables = (props: {
  domain: string | undefined
}) => {
  const { data: rawData } = useVercelListDNSRecords(props.domain);
  const records: RecordItem[] = useMemo(() => {
    const result: RecordItem[] = [];

    if (!rawData) {
      return result;
    }
    // Array.prototype.flat() is way too new and its polyfill is not included in Next.js
    rawData.forEach(page => {
      page.records.forEach(record => {
        result.push({
          id: record.id,
          slug: record.slug,
          name: record.name,
          createdAt: record.createdAt,
          updatedAt: record.updatedAt,
          data: {
            name: record.name,
            type: record.type,
            value: record.value,
            priority: record.mxPriority ?? record.priority,
            action: null
          }
        });
      });
    });

    return result;
  }, [rawData]);

  const tableData = useMemo(() => {
    return records.map(record => record.data);
  }, [records]);

  if (!props.domain) {
    return (
      <Skeleton.DataTable />
    );
  }

  return (
    <DataTables data={tableData} columns={recordDataTableColumns} />
  );
};
