import type React from 'react';
import { forwardRef, useCallback, useMemo } from 'react';

import { Text, Link, useTheme, Spacer, Note } from '@geist-ui/core';
import NextLink from 'next/link';
import NextHead from 'next/head';

import { Layout } from '@/components/layout';
import { DataTable } from '../components/data-tables';
import type { DataTableColumns } from '../components/data-tables';
import { Notice } from '@/components/notice';

import { useVercelDomains } from '@/hooks/use-vercel-domains';
import { formatDate } from '../lib/util';

import MoreVertical from '@geist-ui/icons/moreVertical';

import type { NextPageWithLayout } from '@/pages/_app';
import { Menu, MenuItem } from '../components/menu';
import { useVercelUser } from '../hooks/use-vercel-user';

interface DomainItem {
  name: string,
  nameServer: string,
  createdAt: string
}

const DomainLink = forwardRef((props: { name: string }, ref: React.ForwardedRef<HTMLAnchorElement>) => (
  <NextLink href={`/domain/${props.name}`} prefetch={false} passHref legacyBehavior>
    <Link ref={ref} className="domain">{props.name}</Link>
  </NextLink>
));

if (process.env.NODE_ENV !== 'production') {
  DomainLink.displayName = 'DomainLink';
}

const domainDataTableColumns: Array<DataTableColumns<DomainItem>> = [
  {
    accessor: 'name',
    Header: 'Domain',
    Cell: ({ value }) => (
      <DomainLink name={value} />
    )
  },
  {
    accessor: 'nameServer',
    Header: 'NameServer',
    cellClassName: 'nameserver-cell'
  },
  {
    accessor: 'createdAt',
    Header: 'Created At',
    cellClassName: 'created-cell'
  }
];

const DomainsPage: NextPageWithLayout = () => {
  const theme = useTheme();

  // TODO: filter multiple teams
  const { data: user } = useVercelUser();
  const { data, error } = useVercelDomains(user?.defaultTeamId);

  const processedDomainLists: DomainItem[] = useMemo(() => {
    if (!data) return [];

    return data.domains.map(domain => ({
      name: domain.name,
      nameServer: domain.serviceType === 'zeit.world' ? 'Vercel' : 'Third Party',
      createdAt: formatDate(domain.createdAt)
    }));
  }, [data]);

  const renderDataTableMenu = useCallback((value: DomainItem) => (
    <Menu
      itemMinWidth={180}
      style={{ justifyContent: 'flex-end' }}
      content={(
        <MenuItem>
          <NextLink href={`/domain/${value.name}`} prefetch={false} legacyBehavior>
            <Link>
              Manage DNS Records
            </Link>
          </NextLink>
        </MenuItem>
      )}
    >
      <MoreVertical color={theme.palette.accents_3} size={16} />
    </Menu>
  ), [theme.palette.accents_3]);

  return (
    <div>
      {
        useMemo(() => (
          <>
            <NextHead>
              <title>Domains</title>
            </NextHead>
            <Text h1>Domains</Text>
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
          </>
        ), [])
      }
      <DataTable
        placeHolder={!data && !error ? 4 : false}
        data={processedDomainLists}
        columns={domainDataTableColumns}
        renderRowAction={renderDataTableMenu}
      />
      {
        data && <Notice />
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

DomainsPage.getLayout = (children, _prop) => (
  <Layout>
    {children}
  </Layout>
);

export default DomainsPage;
