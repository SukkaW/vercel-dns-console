import { useMemo } from 'react';
import { Tooltip, useTheme } from '@geist-ui/core';

import { DataTable, type DataTableColumns } from '../data-tables';

import { generateDnsDescription } from '@/lib/generate-dns-description';

import { useVercelListDNSRecords } from '@/hooks/use-vercel-dns';
import type { VercelDNSRecord } from '@/types/dns';

import type { CellProps } from 'react-table';
import InfoFill from '@geist-ui/icons/infoFill';

interface RecordItem {
  id: string,
  slug: string,
  name: string,
  type: VercelDNSRecord['type'],
  priority?: number,
  value: string,
  ttl: number,
  createdAt: number | null,
  updatedAt: number | null,
  isSystem: boolean,
  disableSelection?: boolean;
}

export const DNSDataTables = (props: {
  domain: string | undefined
}) => {
  const theme = useTheme();
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
          type: record.type,
          value: record.value,
          priority: record.mxPriority ?? record.priority,
          ttl: record.ttl,
          createdAt: record.createdAt,
          updatedAt: record.updatedAt,
          isSystem: record.creator === 'system',
          disableSelection: record.creator === 'system'
        });
      });
    });

    return result;
  }, [rawData]);

  const columns: DataTableColumns<RecordItem>[] = useMemo(() => [
    {
      Header: 'Name',
      accessor: 'name',
      width: 300,
      minWidth: 300,
      maxWidth: 300,
      ellipsis: true
    },
    {
      Header: 'Type',
      accessor: 'type',
      width: 80,
      minWidth: 80,
      maxWidth: 80
    },
    {
      Header: 'Priority',
      accessor: 'priority',
      width: 80,
      minWidth: 80,
      maxWidth: 80
    },
    {
      Header: 'Value',
      accessor: 'value',
      width: 350,
      minWidth: 350,
      maxWidth: 350,
      ellipsis: true
    },
    {
      Header: 'TTL',
      accessor: 'ttl',
      width: 80,
      minWidth: 80,
      maxWidth: 80
    },
    {
      id: 'dns-description-tooltip',
      Header: '',
      width: 30,
      minWidth: 30,
      maxWidth: 30,
      Cell({ row }: CellProps<RecordItem, any>) {
        const record = row.original;
        if (props.domain) {
          return (
            <Tooltip
              text={
                <div className="description">
                  {
                    generateDnsDescription(
                      props.domain,
                      record.name,
                      record.value,
                      record.type
                    )
                  }
                </div>
              }
              className="table-cell-tooltip"
              portalClassName="table-cell-tooltip-portal"
              offset={5}
              // visible
              placement="bottomEnd"
            >
              <InfoFill color={theme.palette.accents_3} size={12} />
            </Tooltip>
          );
        }

        return (
          <InfoFill color={theme.palette.accents_3} size={12} />
        );
      }
    }
  ], [props.domain, theme.palette.accents_3]);

  return (
    <div>
      {
        !props.domain
          ? null
          : (
            <DataTable
              data={records}
              columns={columns}
            />
          )
      }
      <style jsx>{`
        :global(div.table-cell-tooltip-portal.table-cell-tooltip-portal) {
          width: 200px;
        }

        @media screen and (min-width: ${theme.layout.breakpointTablet}) {
          :global(.table-cell-tooltip-portal) {
            min-width: 500px;
          }
        }

        div :global(.table-cell-ellipsis) {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          overflow-wrap: break-word;
          word-break: keep-all;
        }
        div :global(.table-cell-tooltip.table-cell-tooltip) {
          display: inline-flex
        }

        :global(.table-cell-tooltip-portal) :global(.inner.inner) {
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
