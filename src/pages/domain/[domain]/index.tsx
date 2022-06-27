import { useCallback, useMemo, useState } from 'react';

import { Button, Card, Spacer, Text } from '@geist-ui/core';
import { Layout } from '@/components/layout';
import { DNSDataTables } from '@/components/dns-data-tables';
import { BreadCrumb } from '@/components/bread-crumb';
import { NameServerListTable } from '@/components/nameserver-table';
import NextLink from 'next/link';

import { useRouter } from 'next/router';
import { useVercelDNSRecords } from '@/hooks/use-vercel-dns';
import { useVercelDomainInfo } from '@/hooks/use-vercel-domains';

import Refresh from '@geist-ui/icons/refreshCcw';

import type { NextPageWithLayout } from '@/pages/_app';

const DNSPage: NextPageWithLayout = () => {
  const router = useRouter();
  const domain = router.query.domain as string | undefined;

  const { mutate } = useVercelDNSRecords(domain);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const domainInfo = useVercelDomainInfo(domain);

  const handleRefreshButtonClick = useCallback(async () => {
    setIsRefreshing(true);
    await mutate();
    setIsRefreshing(false);
  }, [mutate]);

  return (
    <div className="dns-page">
      <BreadCrumb items={[
        { label: 'Domains', href: '/' },
        { id: 'dnspage', label: domain ?? '. . .' }
      ]} />
      <Text h1 font={2}>{domain ?? '. . .'}</Text>
      <Spacer />
      <Text h2 font={1.5}>DNS</Text>
      <div
        className="dns-page__header"
      >
        <Button auto onClick={handleRefreshButtonClick} loading={isRefreshing} icon={<Refresh />} />
        <Spacer inline />
        <NextLink href={`/domain/${domain}/create`}>
          <Button type="success">
            Create record
          </Button>
        </NextLink>
      </div>
      <Spacer />
      {
        useMemo(() => (
          <DNSDataTables domain={domain} />
        ), [domain])
      }
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
    </div>
  );
};

DNSPage.getLayout = (children, prop) => {
  return (
    <Layout>
      {children}
    </Layout>
  );
};

export default DNSPage;
