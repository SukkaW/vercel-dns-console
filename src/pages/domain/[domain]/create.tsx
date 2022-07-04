import { useCallback, useState } from 'react';

import { Text, useToasts } from '@geist-ui/core';
import { Layout } from '@/components/layout';
import { BreadCrumb } from '@/components/bread-crumb';
import { EditDNSRecord, OnSubmit } from '@/components/edit-dns-record';

import { useRouter } from 'next/router';

import { useVercelApiToken } from '@/hooks/use-vercel-api-token';
import { useVercelDNSRecords } from '@/hooks/use-vercel-dns';

import { fetcherWithAuthorization, HTTPError } from '@/lib/fetcher';
import { validateDnsRecord } from '@/lib/validate-record';

import type { NextPageWithLayout } from '@/pages/_app';
import { getRecordData, processRecordValue } from '@/lib/process-record-value';

const CreateRecordPage: NextPageWithLayout = () => {
  const router = useRouter();
  const domain = router.query.domain as string | undefined;

  const [token] = useVercelApiToken();
  const { mutate } = useVercelDNSRecords(domain);
  const { setToast } = useToasts();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit: OnSubmit = useCallback(async (recordInfo) => {
    if (domain && token) {
      try {
        if (!validateDnsRecord(recordInfo)) {
          throw '';
        }
      } catch (e: unknown) {
        console.info(e);
        const errorMessage = typeof e === 'string' ? e : '';

        const text = `Invalid DNS record${errorMessage ? `: ${errorMessage}` : ''}`;
        setToast({
          type: 'error',
          text,
          delay: 5000
        });

        return;
      }

      setIsSubmitting(true);

      const processedRecordValue = processRecordValue(recordInfo);
      const recordData = getRecordData(recordInfo, processedRecordValue);

      try {
        await fetcherWithAuthorization(
          [`/v2/domains/${domain}/records`, token],
          {
            method: 'post',
            mode: 'cors',
            body: JSON.stringify(recordData),
            headers: {
              'Content-Type': 'application/json'
            }
          }
        );
        await mutate();
        router.push(`/domain/${domain}`);
        setIsSubmitting(false);
      } catch (e) {
        setIsSubmitting(false);
        console.info(e);
        let errorMsg = '';
        if (e instanceof HTTPError) {
          console.log(e.info);
          errorMsg = (e.info as any)?.error?.message;
        }

        setToast({
          text: `Failed to create record${errorMsg ? `: ${errorMsg}` : ''}`,
          type: 'error',
          delay: 3000
        });
      }
    }
  }, [domain, mutate, router, setToast, token]);

  return (
    <div>
      <BreadCrumb items={[
        { label: 'Domains', href: '/' },
        { id: 'dnspage', href: `/domain/${domain}`, label: domain ?? '. . .' },
        { id: 'create', label: 'Create Record' }
      ]} />
      <Text h1>Create Record</Text>
      <EditDNSRecord domain={domain} isSubmitting={isSubmitting} onSubmit={handleSubmit} />
    </div>
  );
};

CreateRecordPage.getLayout = (children) => (
  <Layout>
    {children}
  </Layout>
);

export default CreateRecordPage;
