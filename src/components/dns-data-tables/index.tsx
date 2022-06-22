import { useMemo } from 'react';

import { DataTables } from '../data-tables';
import { Skeleton } from '../skeleton';

import { useVercelListDNSRecords } from '@/hooks/use-vercel-dns';
import { type TableColumnProps } from '../geist-table';
import InfoFill from '@geist-ui/icons/infoFill';
import { GeistUIThemes, Tooltip, useTheme } from '@geist-ui/core';
import { generateDnsDescription } from '../../lib/generate-dns-description';
import type { VercelDNSRecord } from '../../types/dns';

interface RecordTableItem {
  name: string;
  priority?: number,
  type: VercelDNSRecord['type'],
  value: string,
  ttl: number,
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

const getRecordDataTableColumns = (theme: GeistUIThemes, domain: string | undefined): TableColumnProps<RecordTableItem>[] => [
  {
    prop: 'name',
    label: 'Name',
    width: 300
  },
  {
    prop: 'type',
    label: 'Type',
    width: 80
  },
  {
    prop: 'priority',
    label: 'Priority',
    width: 80
  },
  {
    prop: 'value',
    label: 'Value',
    width: 350,
    className: 'table-cell-ellipsis'
  },
  {
    prop: 'ttl',
    label: 'TTL',
    width: 100
  },
  {
    prop: 'action',
    label: '',
    width: 40,
    render(value, rowData) {
      if (domain) {
        return (
          <Tooltip
            text={generateDnsDescription(
              domain,
              rowData.name,
              rowData.value,
              rowData.type
            )}
            className="table-cell-tooltip"
            portalClassName="table-cell-tooltip-portal"
            offset={5}
            placement="bottomEnd"
          >
            <InfoFill color={theme.palette.accents_3} size={16} />
          </Tooltip>
        );
      }
      return <InfoFill color={theme.palette.accents_3} size={16} />;
    }
  }
  // {
  //   prop: 'action',
  //   render
  // }
];

export const DNSDataTables = (props: {
  domain: string | undefined
}) => {
  const theme = useTheme();
  const { data: rawData, isLoading } = useVercelListDNSRecords(props.domain);
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
            ttl: record.ttl,
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

  const recordDataTableColumns = useMemo(() => getRecordDataTableColumns(theme, props.domain), [theme, props.domain]);

  return (
    <div>
      {
        !props.domain || isLoading
          ? <Skeleton.DataTable />
          : <DataTables data={tableData} columns={recordDataTableColumns} />
      }
      <style jsx>{`
        div {
          overflow: auto;
        }

        div :global(.table-cell-ellipsis) :global(.cell) {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          overflow-wrap: break-word;
          word-break: keep-all;
        }
        div :global(.tabel-cell-tooltip) {
          display: inline-flex
        }

        :global(.table-cell-tooltip-portal) {
          min-width: 300px;
          max-width: calc(100vw - 42px);
        }

        :global(.table-cell-tooltip-portal) :global(.inner.inner) {
          white-space: nowrap;
          overflow-wrap: break-word;
          word-break: keep-all;
          overflow: auto;
          font-size: 13px;
        }

        @media (max-width: 1050px) {
          :global(.table-cell-tooltip-portal) {
            max-width: ${theme.layout.breakpointTablet}
          }
        }
      `}</style>
    </div>
  );
};
