import { useMemo, useState, useCallback } from 'react';

import { Text } from '@geist-ui/core';
import { Layout } from '@/components/layout';
import { BreadCrumb } from '@/components/bread-crumb';
import { type DNSFormState, EditDNSRecord, type OnSubmit } from '@/components/edit-dns-record';

import { useRouter } from 'next/router';

import { useVercelDNSRecords } from '@/hooks/use-vercel-dns';
import { useVercelApiToken } from '@/hooks/use-vercel-api-token';
import { useToasts } from '@/hooks/use-toasts';

import type { NextPageWithLayout } from '@/pages/_app';
import { validateDnsRecord } from '@/lib/validate-record';
import { fetcherWithAuthorization, HTTPError } from '@/lib/fetcher';
import { getRecordData } from '@/lib/process-record-value';
import { NotFoundError } from '../../../../components/not-found/404';

const EditRecordPage: NextPageWithLayout = () => {
  const router = useRouter();
  const domain = router.query.domain as string | undefined;
  const recordId = router.query.id as string | undefined;

  const [token] = useVercelApiToken();
  const { data, mutate } = useVercelDNSRecords(domain);

  const { setToast } = useToasts();

  const record = useMemo(() => {
    if (data) {
      for (let i = 0, len = data.length; i < len; i++) {
        const { records } = data[i];
        for (let j = 0, len = records.length; j < len; j++) {
          const record = records[j];
          if (record.id === recordId) {
            return record;
          }
        }
      }
    }
    return null;
  }, [data, recordId]);

  const isNotFound = typeof data !== 'undefined' && record === null;

  const initialState = useMemo(() => {
    if (record) {
      const caaTag = record.value.includes('issuewild')
        ? 'issuewild'
        : (record.value.includes('iodef')
          ? 'iodef'
          : 'issue');
      // Next.js doesn't support Array.prototype.at
      const splittedValue = record.value.split(' ');

      const restCaaValue = (record.type === 'CAA' ? splittedValue : []).slice(2);
      let caaValue = restCaaValue.join(' ');
      if (caaValue.startsWith('"')) {
        caaValue = caaValue.slice(1);
      }
      if (caaValue.endsWith('"')) {
        caaValue = caaValue.slice(0, -1);
      }

      const [srvWeightString, srvPortString, srvTarget] = record.type === 'SRV' ? splittedValue : [];
      const srvWeight = srvWeightString ? Number.parseInt(srvWeightString, 10) : null;
      const srvPort = srvPortString ? Number.parseInt(srvPortString, 10) : null;

      const srvProtocol = record.name.includes('._udp.')
        ? '_udp'
        : (record.name.includes('._tls.')
          ? '_tls'
          : '_tcp');

      return {
        recordName: record.name,
        recordType: record.type,
        recordValue: record.value,
        ttl: record.ttl,
        caaTag,
        caaValue,
        srvPort,
        srvPriority: record.priority ?? null,
        srvWeight,
        srvTarget: srvTarget ?? '',
        srvService: '',
        srvProtocol,
        mxPriority: record.mxPriority ?? null
      } as DNSFormState;
    }
    return null;
  }, [record]);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit: OnSubmit = useCallback(async (recordInfo) => {
    if (recordId && token) {
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

      const recordData = getRecordData(recordInfo);

      try {
        await fetcherWithAuthorization(
          [`/v4/domains/records/${recordId}`, token],
          {
            method: 'PATCH',
            mode: 'cors',
            body: JSON.stringify(recordData),
            headers: {
              'Content-Type': 'application/json'
            }
          }
        );
        await mutate();
        router.push(`/domain/${domain!}`);
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
  }, [domain, token, setToast, recordId, mutate, router]);

  return (
    <div>
      <BreadCrumb items={[
        { label: 'Domains', href: '/' },
        { id: 'dnspage', href: `/domain/${domain ?? ''}`, label: domain ?? '. . .' },
        { id: 'edit', label: `Edit ${record?.type || ''} Record` }
      ]} />
      {
        isNotFound
          ? (
            <NotFoundError title="The record can not be found" />
          )
          : (
            <>
              <Text h1>Edit {record?.type || ''} Record</Text>
              <EditDNSRecord
                key={record?.id ?? 'loading'}
                domain={domain}
                isSubmitting={isSubmitting}
                initialState={initialState}
                onSubmit={handleSubmit}
                isEdit
              />
            </>
          )
      }
    </div>
  );
};

EditRecordPage.getLayout = (children) => (
  <Layout>
    {children}
  </Layout>
);

export default EditRecordPage;
