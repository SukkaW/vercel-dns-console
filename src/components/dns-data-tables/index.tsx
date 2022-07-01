import { useCallback, useEffect, useMemo, useState } from 'react';
import { Badge, Code, Text, Tooltip, useTheme } from '@geist-ui/core';

import { DataTable, type DataTableFilterRenderer, type DataTableColumns } from '../data-tables';

import { generateDnsDescription } from '@/lib/generate-dns-description';

import { useVercelDNSRecords } from '@/hooks/use-vercel-dns';
import { useToasts } from '@/hooks/use-toasts';
import { useModal } from '@/hooks/use-modal';
import { useReadonlyMode } from '@/hooks/use-readonly-mode';

import MoreVertical from '@geist-ui/icons/moreVertical';
import InfoFill from '@geist-ui/icons/infoFill';

import { Menu, MenuItem } from '../menu';
import { CopyButton } from '../copy-button';

import type { VercelDNSRecord } from '@/types/dns';
import type { CellProps, FilterType, FilterTypes } from 'react-table';
import { DNSDataTableFilter } from './filter';
import { DeleteRecordModal } from './delete';

export interface RecordItem {
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

const searchInRecordTypeFilterFn: FilterType<RecordItem> = (rows, columnIds, filterValue) => {
  if (!filterValue) return rows;
  return rows.filter(row => row.original.type === filterValue);
};

const searchInRecordNameAndValueFilterFn: FilterType<RecordItem> = (rows, columnIds, filterValue) => {
  if (typeof filterValue === 'string') {
    const query = filterValue.toLowerCase();
    return rows.filter(row => row.original.value.toLowerCase().includes(query) || row.original.name.toLowerCase().includes(query));
  }
  return rows;
};

const filterTypes: FilterTypes<RecordItem> = {
  searchInRecordType: searchInRecordTypeFilterFn,
  searchInRecordNameAndValue: searchInRecordNameAndValueFilterFn
};

const renderFilter: DataTableFilterRenderer<RecordItem> = (setFilter, setGlobalFilter) => (
  <DNSDataTableFilter setFilter={setFilter} setGlobalFilter={setGlobalFilter} />
);

export const DNSDataTables = (props: {
  domain: string | undefined
}) => {
  const theme = useTheme();
  const { setToast, clearToasts } = useToasts();
  const [readOnlyMode] = useReadonlyMode();

  const { data: rawData, error, isLoading } = useVercelDNSRecords(props.domain);
  const hasError = !!error;

  const {
    visible: deleteRecordModalVisible,
    open: openDeleteRecordModal,
    close: closeDeleteRecordModal
  } = useModal();
  const [recordsToBeDeleted, setRecordsToBeDeleted] = useState<RecordItem[]>([]);

  useEffect(() => {
    if (hasError) {
      setToast({
        type: 'error',
        text: 'Failed to load DNS records',
        delay: 3000
      });

      return () => clearToasts();
    }
  }, [hasError, setToast, clearToasts]);

  const records: RecordItem[] = useMemo(() => {
    const result: RecordItem[] = [];
    // Array.prototype.flat() is way too new and its polyfill is not included in Next.js
    if (!rawData) {
      return result;
    }

    rawData.forEach(page => {
      page.records.forEach(record => {
        result.push({
          id: record.id,
          slug: record.slug,
          name: record.name === '' ? '@' : record.name,
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

    // sort by updatedAt
    return result.sort((a, b) => (b.updatedAt || b.createdAt || 0) - (a.updatedAt || a.createdAt || 0));
  }, [rawData]);

  const columns: DataTableColumns<RecordItem>[] = useMemo(() => [
    {
      Header: 'Name',
      accessor: 'name',
      width: 300,
      minWidth: 300,
      maxWidth: 300,
      ellipsis: true,
      filter: 'searchInRecordNameAndValue',
      Cell({ value }) {
        if (value.length > 10) {
          return (
            <Tooltip
              text={(
                <>
                  <Code style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>{value}</Code>
                  <CopyButton auto scale={1 / 4} ml={1} copyValue={value} />
                </>
              )}
              // visible
              placement="bottomStart"
              className="dns-data-tables__tooltip table-cell-ellipsis"
              portalClassName="table-cell-tooltip-portal record"
              offset={5}
            >
              {value}
            </Tooltip>
          );
        }
        return <>{value}</>;
      }
    },
    {
      Header: 'Type',
      accessor: 'type',
      width: 80,
      minWidth: 80,
      maxWidth: 80,
      filter: 'searchInRecordType'
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
      ellipsis: true,
      filter: 'searchInRecordNameAndValue',
      Cell({ value }) {
        return (
          <Tooltip
            text={(
              <>
                <Code style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>{value}</Code>
                <CopyButton auto scale={1 / 4} ml={1} copyValue={value} />
              </>
            )}
            placement="bottomStart"
            className="dns-data-tables__tooltip table-cell-ellipsis"
            portalClassName="table-cell-tooltip-portal record-value"
            // visible
            offset={5}
          >
            {value}
          </Tooltip>
        );
      }
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
              portalClassName="table-cell-tooltip-portal record-description"
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

  const renderHeaderAction = useCallback((selected: RecordItem[]) => (
    <Menu
      itemMinWidth={120}
      content={(
        readOnlyMode
          ? (
            <MenuItem disableAutoClose>
              <Text span type="secondary" w={8}>
                Delete is disabled
              </Text>
            </MenuItem>
          )
          : (
            <MenuItem onClick={() => {
              setRecordsToBeDeleted(selected);
              openDeleteRecordModal();
            }}>
              <Text span type={selected.length ? 'error' : 'secondary'}>
                Delete ({selected.length})
              </Text>
            </MenuItem>
          )
      )}
    >
      <Badge.Anchor>
        {selected.length > 0 && <Badge style={{ userSelect: 'none' }} scale={1 / 3}>{selected.length}</Badge>}
        <MoreVertical color={theme.palette.accents_3} size={16} />
      </Badge.Anchor>
    </Menu>
  ), [openDeleteRecordModal, readOnlyMode, theme.palette.accents_3]);

  const renderRowAction = useCallback((record: RecordItem) => {
    return (
      <Menu
        itemMinWidth={100}
        content={(
          readOnlyMode
            ? (
              <MenuItem disableAutoClose>
                <Text span type="secondary" w={12}>
                  Edit and Delete are disabled
                </Text>
              </MenuItem>
            )
            : (
              <>
                <MenuItem>
                  <Text span>
                    Edit
                  </Text>
                </MenuItem>
                <MenuItem onClick={() => {
                  setRecordsToBeDeleted([record]);
                  openDeleteRecordModal();
                }}>
                  <Text span type="error">
                    Delete
                  </Text>
                </MenuItem>
              </>
            )
        )}
      >
        <MoreVertical color={theme.palette.accents_3} size={16} />
      </Menu>
    );
  }, [openDeleteRecordModal, readOnlyMode, theme.palette.accents_3]);

  const isDataTablePlaceHolder = (!props.domain) || isLoading;

  const dataTable = useMemo(() => (
    <DataTable
      placeHolder={isDataTablePlaceHolder ? 5 : false}
      data={records}
      columns={columns}
      renderHeaderAction={renderHeaderAction}
      renderRowAction={renderRowAction}
      renderFilter={renderFilter}
      tableOptions={{
        filterTypes
      }}
    />
  ), [columns, isDataTablePlaceHolder, records, renderHeaderAction, renderRowAction]);

  return (
    <div>
      {dataTable}
      {
        props.domain && <DeleteRecordModal
          visible={deleteRecordModalVisible}
          close={closeDeleteRecordModal}
          domain={props.domain}
          records={recordsToBeDeleted}
        />
      }
      <style jsx>{`
        div {
          width: 100%;
        }

        @media screen and (max-width: ${theme.breakpoints.sm.max}) {
          :global(div.table-cell-tooltip-portal.table-cell-tooltip-portal) {
            width: 200px;
          }
        }

        @media screen and (min-width: ${theme.breakpoints.sm.min}) {
          :global(.table-cell-tooltip-portal.record) {
            max-width: 400px;
          }
          :global(.table-cell-tooltip-portal.record-value) {
            max-width: 400px;
          }
          :global(.table-cell-tooltip-portal.record-description) {
            min-width: 400px;
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

        :global(.dns-data-tables__tooltip) {
          width: 100%;
        }

        div :global(td .tooltip) {
          width: 100%;
        }

        :global(.table-cell-tooltip-portal) :global(.inner.inner) {
          font-size: 13px;
          display: flex;
          align-items: center;
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
