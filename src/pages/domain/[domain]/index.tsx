import { useCallback, useMemo, useState } from 'react';

import { Button, Card, Note, Spacer, Text } from '@geist-ui/core';
import { Layout } from '@/components/layout';
import { DNSDataTables } from '@/components/dns-data-tables';
import { BreadCrumb } from '@/components/bread-crumb';
import { NameServerListTable } from '@/components/nameserver-table';
import NextLink from 'next/link';
import NextHead from 'next/head';

import { useRouter } from 'next/router';
import { useVercelDNSRecords } from '@/hooks/use-vercel-dns';
import { useVercelDomainInfo } from '@/hooks/use-vercel-domains';
import { useIsReadonly } from '@/contexts/readonly-mode';

import Refresh from '@geist-ui/icons/refreshCcw';

import type { NextPageWithLayout } from '@/pages/_app';
import { HTTPError } from '@/lib/fetcher';
import { NotFoundError } from '@/components/not-found/404';

const DNSPage: NextPageWithLayout = () => {
  const domain = useRouter().query.domain as string | undefined;

  const { error, mutate } = useVercelDNSRecords(domain);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const readOnlyMode = useIsReadonly();

  const domainInfo = useVercelDomainInfo(domain);

  const handleRefreshButtonClick = useCallback(async () => {
    setIsRefreshing(true);
    await mutate();
    setIsRefreshing(false);
  }, [mutate]);

  const title = `DNS${domain ? `: ${domain}` : ''}`;

  const isNotFound = useMemo(() => error && error instanceof HTTPError && error.status === 404, [error]);

  return (
    <div className="dns-page">
      <NextHead>
        <title>{title}</title>
      </NextHead>
      <BreadCrumb items={[
        { label: 'Domains', href: '/' },
        { id: 'dnspage', label: domain ?? '. . .' }
      ]}
      />
      {
        isNotFound
          ? (
            <NotFoundError
              title={`The domain ${domain ?? ''} can not be found`}
            />
          )
          : (
            <>
              <Text h1 font={2}>{domain ?? '. . .'}</Text>
              <Spacer />
              <Text h2 font={1.5}>DNS</Text>
              {
                readOnlyMode && (
                  <>
                    <Note type="warning">
                      You have entered read-only mode, you can not create, edit, or delete any DNS records.
                    </Note>
                    <Spacer />
                  </>
                )
              }
              <div
                className="dns-page__header"
              >
                <Button auto onClick={handleRefreshButtonClick} loading={isRefreshing} icon={<Refresh />} />
                <Spacer inline />
                {
                  readOnlyMode
                    ? (
                      <Button disabled>
                        Create record
                      </Button>
                    )
                    : (
                      domain
                        ? (
                          <NextLink href={`/domain/${domain}/create`} legacyBehavior>
                            <Button type="success">
                              Create record
                            </Button>
                          </NextLink>
                        )
                        : (
                          <Button type="success" disabled>
                            Create record
                          </Button>
                        )
                    )
                }
              </div>
              <Spacer />
              <DNSDataTables domain={domain} />
              <Spacer />
              <Text h2 font={1.5}>Nameservers</Text>
              <Card shadow>
                <NameServerListTable intended={domainInfo?.intendedNameservers} actual={domainInfo?.nameservers} />
              </Card>
              <style jsx>{`
                .dns-page {
                  width: 100%;
                }
                .dns-page__header {
                  width: 100%;
                  display: flex;
                  justify-content: flex-end;
                }
              `}</style>
            </>
          )
      }
    </div>
  );
};

DNSPage.getLayout = (children, _prop) => (
  <Layout>
    {children}
  </Layout>
);

export default DNSPage;
