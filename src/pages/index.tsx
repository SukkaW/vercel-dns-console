import React, { forwardRef, useCallback, useEffect, useMemo } from 'react';

import { Text, Link, useTheme, type TableColumnProps, useToasts, Spacer, Note, Popover } from '@geist-ui/core';
import NextLink from 'next/link';

import { Layout } from '@/components/layout';
import { DataTables } from '@/components/legacy/data-tables';
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
      <NextLink href={`/domain/${props.name}`} prefetch={false}>
        <Link ref={ref} className="domain">{props.name}</Link>
      </NextLink>
    </>
  );
});

if (process.env.NODE_ENV !== 'production') {
  DomainLink.displayName = 'DomainLink';
}

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
    label: 'NameServer',
    className: 'nameserver-cell'
  },
  {
    prop: 'createdAt',
    label: 'Created At',
    className: 'created-cell'
  }
];

const DomainsPage: NextPageWithLayout = () => {
  const { setToast: origSetToast, removeAll: origRemoveAllToasts } = useToasts();
  const theme = useTheme();
  const { data, error } = useVercelDomains();
  const setToast = useConstHandler(origSetToast);
  const removeAllToasts = useConstHandler(origRemoveAllToasts);

  const hasError = useMemo(() => !!error, [error]);

  useEffect(() => {
    if (hasError) {
      setToast({
        type: 'error',
        text: 'Failed to load domains list',
        delay: 3000
      });

      return () => {
        removeAllToasts();
      };
    }
  }, [hasError, setToast, removeAllToasts]);

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

  const renderDataTableMenu = useCallback((value: DomainItem[keyof DomainItem], rowData: DomainItem, rowIndex: number) => (
    <>
      <Popover.Item>
        <NextLink href={`/domain/${value}`} prefetch={false}>
          <Link>
            Manage DNS Records
          </Link>
        </NextLink>
      </Popover.Item>
    </>
  ), []);

  return (
    <div>
      <Text h1>Domains</Text>
      {
        processedDomainLists
          ? (
            <DataTables<DomainItem>
              data={processedDomainLists}
              columns={domainDataTableColumns}
              renderRowMenuItems={renderDataTableMenu}
            />
          )
          : <Skeleton.DataTable />
      }
      {
        processedDomainLists && (
          <>
            <Spacer h={2} />
            <Note type="warning">
              You can only manage your DNS records here. Please go to
              {' '}
              <Link
                href="https://vercel.com"
                target="_blank"
                rel="external nofollow noreferrer noopenner"
                icon
                color
                underline
              >
                https://vercel.com
              </Link>
              {' '}
              to buy / transfer / renew / add / remove your domains.
            </Note>
            <Spacer h={2} />
            <Notice />
          </>
        )
      }
      <style jsx>{`
       div :global(.domain) {
         border-bottom: 1px dashed ${theme.palette.accents_3};
       }

       @media screen and (max-width: 475px) {
          div :global(.nameserver-cell),
          div :global(.created-cell) {
            display: none;
          }
       }
      `}</style>
    </div>
  );
};

DomainsPage.getLayout = (children, prop) => {
  return (
    <Layout>
      {children}
    </Layout>
  );
};

export default DomainsPage;
