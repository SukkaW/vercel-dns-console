import { useCallback, useMemo, useState, useTransition } from 'react';

import { Input, Select, Spacer, Spinner, useScale, useTheme, withScale } from '@geist-ui/core';
import { VERCEL_SUPPORTED_DNS_RECORDS_TYPE } from '@/lib/constant';
import Search from '@geist-ui/icons/search';

import type { VercelDNSRecord } from '@/types/dns';
import type { TableDataItemBase } from '../data-tables/types';
import type { RecordItem } from '.';

export interface DNSDataTableFilterProps<T extends TableDataItemBase> {
  setFilter: (columnId: keyof T, updater: any) => void,
  setGlobalFilter: (updater: string) => void,
}

const DNSDataTableFilter = <T extends RecordItem>({ setFilter }: DNSDataTableFilterProps<T>) => {
  const theme = useTheme();
  const [input, setInput] = useState('');
  const [recordType, setRecordType] = useState<VercelDNSRecord['type'][]>([]);
  const { SCALES } = useScale();

  const [isSearchQueryPending, startSearchQueryTransition] = useTransition();
  const [, startRecordTypeTransition] = useTransition();

  const handleInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInput(value);
    startSearchQueryTransition(() => setFilter('name', value));
  }, [setFilter]);

  const handleRecordTypeChange = useCallback((value: string | string[]) => {
    const arr = (typeof value === 'string' ? [value] : value) as Array<VercelDNSRecord['type']>;
    setRecordType(arr);
    startRecordTypeTransition(() => setFilter('type', arr.length === 0 ? null : arr));
  }, [setFilter]);

  const seatchQueryInputElement = useMemo(() => (
    <Input
      value={input}
      onChange={handleInput}
      icon={isSearchQueryPending ? <Spinner scale={1 / 2} /> : <Search />}
      className="search-input"
      placeholder="Filter records by names and values"
      clearable
      h={1}
    />
  ), [handleInput, isSearchQueryPending, input]);

  const selectRecordTypeElement = useMemo(() => (
    <Select
      value={recordType ?? undefined}
      onChange={handleRecordTypeChange}
      placeholder="Record Type"
      multiple
      clearable
      className="select-record-type"
      h={1}
    >
      {VERCEL_SUPPORTED_DNS_RECORDS_TYPE.map((recordType) => (
        <Select.Option key={recordType} value={recordType}>{recordType}</Select.Option>
      ))}
    </Select>
  ), [handleRecordTypeChange, recordType]);

  return (
    <div>
      {seatchQueryInputElement}
      <Spacer inline />
      {selectRecordTypeElement}
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

        div :global(.multiple.select-record-type) {
          min-width: ${SCALES.font(15)};
          padding: ${SCALES.pt(1 / 3)} ${SCALES.pr(1.5)} ${SCALES.pb(1 / 3)} ${SCALES.pl(1 / 2)};
        }

        @media screen and (max-width: ${theme.breakpoints.sm.min}) {
          div :global(.multiple.select-record-type) {
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
          display: flex;
          flex-grow: 1;
        }

        div :global(.multiple) {
          height: var(--select-height);
          max-height: var(--select-height);
        }

        div :global(.item .option) {
          height: ${SCALES.height(1)};
        }

        div :global(.item .option span) {
          line-height: ${SCALES.font(1)};
        }
      `}</style>
    </div>
  );
};

const ScaledDNSDataTableFilter = withScale(DNSDataTableFilter) as typeof DNSDataTableFilter;

export {
  ScaledDNSDataTableFilter as DNSDataTableFilter
};
