import React, { forwardRef, useEffect, useMemo } from 'react';

import { Text, Link, useTheme, type TableColumnProps, useToasts, Spacer } from '@geist-ui/core';
import NextLink from 'next/link';

import { Layout } from '@/components/layout';
import { DataTables } from '@/components/data-tables';
import { Skeleton } from '@/components/skeleton';
import { Notice } from '@/components/notice';

import { useConstHandler } from '@/hooks/use-const-handler';
import { useVercelDomains } from '@/hooks/use-vercel-domains';
import { formatDate } from '../lib/util';

import type { NextPageWithLayout } from '@/pages/_app';

interface DomainItem {
  name: string;
  nameServer: string,
  createdAt: string;
}

const DomainLink = forwardRef((props: { name: string }, ref: React.ForwardedRef<HTMLAnchorElement>) => {
  return (
    <>
      <NextLink href={'#'} prefetch={false}>
        <Link ref={ref} className="domain">{props.name}</Link>
      </NextLink>
    </>
  );
});

if (process.env.NODE_ENV !== 'production') {
  DomainLink.displayName = 'DomainLink';
}

const Domains: NextPageWithLayout = () => {
  const { setToast: origSetToast, removeAll: origRemoveAllToasts } = useToasts();
  const theme = useTheme();
  const { data, error } = useVercelDomains();
  const setToast = useConstHandler(origSetToast);
  const removeAllToasts = useConstHandler(origRemoveAllToasts);

  useEffect(() => {
    if (error) {
      setToast({
        type: 'error',
        text: 'Failed to load domains list',
        delay: 3000
      });

      return () => {
        removeAllToasts();
      };
    }
  }, [error, setToast, removeAllToasts]);

  const domainDataTableColumns: TableColumnProps<DomainItem>[] = [
    {
      prop: 'name',
      label: 'Domain',
      render: (value, rowData) => (
        <NextLink href={'#'}>
          <DomainLink name={value} />
        </NextLink>
      )
    },
    {
      prop: 'nameServer',
      label: 'NameServer'
    },
    {
      prop: 'createdAt',
      label: 'Created At'
    }
  ];

  const processedDomainLists: DomainItem[] | null = useMemo(() => {
    if (!data) return null;

    return data.domains.map(domain => {
      return {
        name: domain.name,
        nameServer: domain.serviceType === 'zeit.world' ? 'Vercel' : 'Third Party',
        createdAt: formatDate(domain.createdAt)
      };
    });
  }, [data]);

  return (
    <div>
      <Text h1>Domains</Text>
      {
        processedDomainLists
          ? <DataTables<DomainItem> data={processedDomainLists} columns={domainDataTableColumns} />
          : <Skeleton.DataTable />
      }
      <Spacer />
      <Notice />
      <style jsx>{`
       div :global(.domain) {
         border-bottom: 1px dashed ${theme.palette.accents_3};
       }
      `}</style>
    </div>
  );
};

Domains.getLayout = (children, prop) => {
  return (
    <Layout>
      {children}
    </Layout>
  );
};

export default Domains;
