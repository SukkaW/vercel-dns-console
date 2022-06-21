import { useMemo } from 'react';

import { Text, Link, useTheme, type TableColumnProps } from '@geist-ui/core';
import NextLink from 'next/link';

import { Layout } from '@/components/layout';
import { DataTables } from '@/components/data-tables';

import { useVercelDomains } from '@/hooks/use-vercel-domains';
import { formatDate } from '../lib/util';

import type { NextPageWithLayout } from '@/pages/_app';
import { Skeleton } from '../components/skeleton';

interface DomainItem {
  name: string;
  nameServer: string,
  createdAt: string;
}

const DomainLink = (props: { name: string }) => {
  return (
    <>
      <NextLink href={'#'} prefetch={false}>
        <Link className="domain">{props.name}</Link>
      </NextLink>
    </>
  );
};

const Domains: NextPageWithLayout = () => {
  const theme = useTheme();
  const { data } = useVercelDomains();

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

  console.log(data);

  return (
    <div>
      <Text h1>Domains</Text>
      {
        processedDomainLists
          ? <DataTables<DomainItem> data={processedDomainLists} columns={domainDataTableColumns} />
          : <Skeleton.DataTable />
      }
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
