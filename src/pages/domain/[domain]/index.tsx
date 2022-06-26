import { Button, Spacer, Text } from '@geist-ui/core';
import { Layout } from '@/components/layout';
import { DNSDataTables } from '@/components/dns-data-tables';
import { BreadCrumb } from '@/components/bread-crumb';

import { useRouter } from 'next/router';

import type { NextPageWithLayout } from '../../_app';

const DNSPage: NextPageWithLayout = (props) => {
  const router = useRouter();
  const domain = router.query.domain as string | undefined;

  return (
    <div className="dns-page">
      <BreadCrumb items={[
        { label: 'Domains', href: '/' },
        { id: 'dnspage', label: domain ?? '. . .' }
      ]} />
      <Text h1>DNS</Text>
      <div
        className="dns-page__header"
      >
        <Button type="success">
          Create record
        </Button>
      </div>
      <Spacer />
      <DNSDataTables domain={domain} />
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
