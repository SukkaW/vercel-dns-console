import { Text } from '@geist-ui/core';
import { Layout } from '@/components/layout';
import { DNSDataTables } from '@/components/dns-data-tables';

import { useRouter } from 'next/router';

import type { NextPageWithLayout } from '../_app';

const DNSPage: NextPageWithLayout = (props) => {
  const router = useRouter();
  const domain = router.query.domain as string | undefined;

  return (
    <div className="dns-page">
      <Text h1>DNS</Text>
      <DNSDataTables domain={domain} />
      <style jsx>{`
        .dns-page {
          width: 100%;
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
