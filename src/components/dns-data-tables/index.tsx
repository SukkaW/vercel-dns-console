import { useCallback, useMemo } from 'react';

import { GeistUIThemes, Popover, Tooltip, Text, useTheme } from '@geist-ui/core';

import { DataTables } from '../data-tables';
import { Skeleton } from '../skeleton';

import InfoFill from '@geist-ui/icons/infoFill';
import Lock from '@geist-ui/icons/lock';

import { useVercelListDNSRecords } from '@/hooks/use-vercel-dns';
import { generateDnsDescription } from '@/lib/generate-dns-description';

import { type TableColumnProps } from '../geist-table';
import type { VercelDNSRecord } from '@/types/dns';

interface RecordTableItem {
  name: string;
  priority?: number,
  type: VercelDNSRecord['type'],
  value: string,
  ttl: number,
  action: null,
  menu: null,
  isSystem: boolean
}

interface RecordItem {
  id: string,
  slug: string,
  name: string,
  createdAt: number | null,
  updatedAt: number | null,
  data: RecordTableItem,
  isSystem: boolean
}

const getRecordDataTableColumns = (theme: GeistUIThemes, domain: string | undefined): TableColumnProps<RecordTableItem>[] => [
  // Action width 30
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
    width: 80
  },
  {
    prop: 'action',
    label: '',
    width: 40,
    render(value, rowData) {
      return (
        <>
          {domain
            ? (
              <Tooltip
                text={
                  <div className="description">
                    {
                      generateDnsDescription(
                        domain,
                        rowData.name,
                        rowData.value,
                        rowData.type
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
                <span>
                  <InfoFill color={theme.palette.accents_3} size={16} />
                </span>
              </Tooltip>
            )
            : (
              <span>
                <InfoFill color={theme.palette.accents_3} size={16} />
              </span>
            )}
          <style jsx>{`
            span {
              display: inline-flex;
            }

            .description {
              // white-space: nowrap;
              overflow-wrap: break-word;
              word-break: break-word;
              word-wrap: break-word;
            }
          `}</style>
        </>
      );
    }
  }
  // {
  //   prop: 'menu',
  //   render
  //   width: 40
  // }
];

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
          createdAt: record.createdAt,
          updatedAt: record.updatedAt,
          isSystem: record.creator === 'system',
          data: {
            name: record.name,
            type: record.type,
            value: record.value,
            priority: record.mxPriority ?? record.priority,
            ttl: record.ttl,
            action: null,
            menu: null,
            isSystem: record.creator === 'system'
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
  const renderRecordDataTableMenu = useCallback(
    (value: RecordTableItem[keyof RecordTableItem], rowData: RecordTableItem, rowIndex: number) => (
      <>
        <Popover.Item>
          Edit
        </Popover.Item>
        <Popover.Item>
          {rowData.isSystem
            ? <Text span small>{'You can\'t delete system record'}</Text>
            : <Text type="error" span>Delete</Text>}
        </Popover.Item>
      </>
    ),
    []
  );

  const renderRecordDataTableAction = useCallback(
    (rowData: RecordTableItem, rowIndex: number) => {
      if (rowData.isSystem) {
        return (
          <Lock size={16} />
        );
      }
    },
    []
  );

  return (
    <div>
      {
        !props.domain
          ? <Skeleton.DataTable />
          : (
            <DataTables
              data={tableData}
              columns={recordDataTableColumns}
              renderRowMenuItems={renderRecordDataTableMenu}
              overwriteRowActionItems={renderRecordDataTableAction}
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

        div :global(.table-cell-ellipsis) :global(.cell) {
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
