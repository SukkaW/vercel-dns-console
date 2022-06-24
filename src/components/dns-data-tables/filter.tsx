import { useCallback, useState, useTransition } from 'react';

import { Input, Select, Spacer, Spinner, useTheme } from '@geist-ui/core';
import { VERCEL_SUPPORTED_DNS_RECORDS_TYPE } from '@/lib/constant';
import Search from '@geist-ui/icons/search';

import type { VercelDNSRecord } from '@/types/dns';
import type { TableDataItemBase } from '../data-tables/types';
import type { RecordItem } from '.';

export interface DNSDataTableFilterProps<T extends TableDataItemBase> {
  setFilter: (columnId: keyof T, updater: any) => void,
  setGlobalFilter: (updater: string) => void,
}

export const DNSDataTableFilter = <T extends RecordItem>({ setFilter }: DNSDataTableFilterProps<T>) => {
  const theme = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [recordType, setRecordType] = useState<VercelDNSRecord['type'] | null>(null);

  const [isSearchQueryPending, startSearchQueryTransition] = useTransition();
  const [, startRecordTypeTransition] = useTransition();

  const handleSearchQueryChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    startSearchQueryTransition(() => setFilter('name', value));
  }, [setFilter]);

  const handleRecordTypeChange = useCallback((value: string | string[]) => {
    if (typeof value === 'string') {
      setRecordType(value as VercelDNSRecord['type']);
      startRecordTypeTransition(() => setFilter('type', value));
    }
  }, [setFilter]);

  return (
    <div>
      <Input
        value={searchQuery}
        onChange={handleSearchQueryChange}
        icon={isSearchQueryPending ? <Spinner scale={1 / 2} /> : <Search />}
        className="search-input"
        placeholder="Filter records by names and values"
        h={1}
      />
      <Spacer inline />
      <Select
        value={recordType ?? undefined}
        onChange={handleRecordTypeChange}
        placeholder="Record Type"
        className="select-record-type"
      >
        <Select.Option key={recordType} value="">All Record Type</Select.Option>
        {VERCEL_SUPPORTED_DNS_RECORDS_TYPE.map((recordType) => (
          <Select.Option key={recordType} value={recordType}>{recordType}</Select.Option>
        ))}
      </Select>
      <style jsx>{`
        div {
          display: flex;
          position: relative;
          min-width: 1px;
          max-width: 100%;
          flex: 1;
          justify-content: flex-start;
          align-items: stretch;
          flex-direction: column;
        }

        @media screen and (max-width: ${theme.breakpoints.sm.min}) {
          div :global(.select-record-type) {
            flex-grow: 1;
            max-width: 100%;
          }
        }

        @media screen and (min-width: ${theme.breakpoints.sm.min}) {
          div {
            flex-direction: row;
            flex-wrap: wrap;
          }
        }

        div :global(.search-input) {
          width: 100%;
        }

        div :global(.with-label) {
          flex-grow: 1;
        }
      `}</style>
    </div>
  );
};
