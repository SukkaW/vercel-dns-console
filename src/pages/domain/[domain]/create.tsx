import React, { useCallback, useMemo, useState } from 'react';

import { Button, ButtonGroup, Code, Grid, Input, Select, Spacer, Text, Textarea, useInput } from '@geist-ui/core';
import { Layout } from '@/components/layout';
import { BreadCrumb } from '@/components/bread-crumb';

import { useRouter } from 'next/router';

import { useVercelApiToken } from '@/hooks/use-vercel-api-token';
import { useToasts } from '@/hooks/use-toasts';
import { useVercelDNSRecords } from '@/hooks/use-vercel-dns';
import { useReadonlyMode } from '@/hooks/use-readonly-mode';

import { generateDnsDescription } from '@/lib/generate-dns-description';
import { VERCEL_SUPPORTED_DNS_RECORDS_TYPE } from '@/lib/constant';
import { Label } from '@/components/create-record/label';
import { fetcherWithAuthorization, HTTPError } from '@/lib/fetcher';

import type { NextPageWithLayout } from '@/pages/_app';
import type { VercelSupportedDNSType } from '@/types/dns';
import { validateDnsRecord } from '@/lib/validate-record';
import { noop } from '@/lib/util';

type CAATag = 'issue' | 'issuewild' | 'iodef';
type SrvProtocol = '_tcp' | '_udp' | '_tls';

type UseNumberState = (initialValue: number | null) => Readonly<[
  number | null,
  (value: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | string | number) => void
]>;
const useInputNumberState: UseNumberState = (initialValue) => {
  const [value, setValue] = useState<number | null>(initialValue);

  const setNumber = useCallback((input: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | string | number) => {
    let v;
    if (typeof input === 'string') {
      if (input === '') {
        setValue(null);
        return;
      }

      v = Number.parseInt(input, 10);
    } else if (typeof input === 'number') {
      v = input;
    } else if (input.target) {
      if (input.target.value === '') {
        setValue(null);
        return;
      }
      v = Number.parseInt(input.target.value, 10);
    }

    if (v && !Number.isNaN(v)) {
      setValue(v);
    }
  }, []);

  return [value, setNumber] as const;
};

const CreateRecprdPage: NextPageWithLayout = () => {
  const router = useRouter();
  const domain = router.query.domain as string | undefined;
  const [token] = useVercelApiToken();
  const { mutate } = useVercelDNSRecords(domain);
  const { setToast } = useToasts();
  const [readOnlyMode] = useReadonlyMode();

  const { state: recordName, bindings: recordNameBindings } = useInput('');
  const [recordType, setRecordType] = useState<VercelSupportedDNSType>('A');
  const isSrv = recordType === 'SRV';

  const { state: recordValue, bindings: recordValueBindings } = useInput('');

  const [caaTag, setCaaTag] = useState<CAATag>('issue');
  const handleSelectCaaTag = useCallback((value: string | string[]) => {
    if (typeof value === 'string') {
      setCaaTag(value as CAATag);
    }
  }, []);

  const { state: caaValue, bindings: caaValueBindings } = useInput('');
  const { state: srvService, bindings: srvServiceBindings } = useInput('');

  const [srvProtocol, setSrvProtocol] = useState<SrvProtocol>('_tcp');
  const handleSelectSrvProtocol = useCallback((value: string | string[]) => {
    if (typeof value === 'string') {
      setSrvProtocol(value as SrvProtocol);
    }
  }, []);

  const [mxPriority, setMxPriority] = useInputNumberState(null);

  const { state: srvTarget, bindings: srvTargetBindings } = useInput('');
  const [srvPort, setSrvPort] = useInputNumberState(null);
  const [srvPriority, setSrvPriority] = useInputNumberState(null);
  const [srvWeight, setSrvWeight] = useInputNumberState(null);

  const [ttl, setTtl] = useInputNumberState(60);

  const recordValuePlaceHolder = useMemo(() => {
    switch (recordType) {
      case 'A':
        return '76.76.21.21';
      case 'AAAA':
        return '2001:4860:4860::8888';
      case 'CNAME': case 'ALIAS':
        return 'cname.cdn.example.com';
      case 'MX':
        return 'mail.example.com';
      case 'NS':
        return 'ns1.example.com';
      case 'TXT':
        return 'my text record';
      default:
        return '';
    }
  }, [recordType]);

  const recordValueInputNode = useMemo(() => {
    if (recordType === 'MX') {
      return (
        <Grid.Container gap={2} justify="flex-start">
          <Grid xs={15}>
            <Input clearable placeholder={recordValuePlaceHolder} w="100%" {...recordValueBindings}>
              Record Value
            </Input>
          </Grid>
          <Grid xs={9}>
            <Input clearable placeholder="10" w="100%" value={mxPriority?.toString() ?? ''} onChange={setMxPriority}>
              Priority
            </Input>
          </Grid>
        </Grid.Container>
      );
    }

    if (recordType === 'SRV') {
      return (
        <Grid.Container gap={2} justify="flex-start">
          <Grid xs={24} md={7}>
            <Input clearable placeholder="_servicename" w="100%" {...srvServiceBindings}>
              Service Name
            </Input>
          </Grid>
          <Grid xs={12} md={5}>
            <Label label="Protocol">
              <Select
                placeholder="Record Type"
                className="select-type"
                value={srvProtocol}
                onChange={handleSelectSrvProtocol}
              >
                <Select.Option key="tcp" value="_tcp">TCP (_tcp)</Select.Option>
                <Select.Option key="udp" value="_udp">UDP (_udp)</Select.Option>
                <Select.Option key="tls" value="_tls">TLS (_tls)</Select.Option>
              </Select>
            </Label>
          </Grid>
          <Grid xs={12} md={4}>
            <Input clearable placeholder="0" w="100%" value={srvPriority?.toString() ?? ''} onChange={setSrvPriority}>
              Priority
            </Input>
          </Grid>
          <Grid xs={12} md={4}>
            <Input clearable placeholder="0" w="100%" value={srvWeight?.toString() ?? ''} onChange={setSrvWeight}>
              Weight
            </Input>
          </Grid>
          <Grid xs={12} md={4}>
            <Input clearable placeholder="0" w="100%" value={srvPort?.toString() ?? ''} onChange={setSrvPort}>
              Port
            </Input>
          </Grid>
          <Grid xs={24}>
            <Input clearable placeholder="_servicename.example.com" w="100%" {...srvTargetBindings}>
              Target
            </Input>
          </Grid>
        </Grid.Container>
      );
    }

    if (recordType === 'CAA') {
      return (
        <Grid.Container gap={2} justify="flex-start">
          <Grid xs={6} md={3}>
            <Label label="Flag">
              <Text p>0</Text>
            </Label>
          </Grid>
          <Grid xs={18} md={9}>
            <Label label="Tag">
              <Select
                className="select-type"
                value={caaTag}
                onChange={handleSelectCaaTag}
              >
                <Select.Option key="issue" value="issue">issue (only allows specific hostnames)</Select.Option>
                <Select.Option key="issuewild" value="issuewild">issuewild (only allows wildcards)</Select.Option>
                <Select.Option key="iodef" value="iodef">iodef (sends violation reports to URL)</Select.Option>
              </Select>
            </Label>
          </Grid>
          <Grid xs={24} md={12}>
            <Input clearable placeholder={
              caaTag === 'iodef'
                ? 'http:, https:, or mailto:'
                : 'letsencrypt.org'
            } w="100%" {...caaValueBindings}>
              {caaTag === 'iodef' ? 'Report URL' : 'CA Domain Name'}
            </Input>
          </Grid>
        </Grid.Container>
      );
    }

    if (recordType === 'TXT') {
      return (
        <Label label="Record Value">
          <Textarea placeholder={recordValuePlaceHolder} h={4} width="100%" resize="vertical" {...recordValueBindings} />
        </Label>
      );
    }

    return (
      <Input
        clearable
        placeholder={recordValuePlaceHolder}
        w="100%"
        {...recordValueBindings}
      >
        Record Value
      </Input>
    );
  }, [caaTag, caaValueBindings, handleSelectCaaTag, handleSelectSrvProtocol, mxPriority, recordType, recordValueBindings, recordValuePlaceHolder, setMxPriority, setSrvPort, setSrvPriority, setSrvWeight, srvPort, srvPriority, srvProtocol, srvServiceBindings, srvTargetBindings, srvWeight]);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = useCallback(async () => {
    if (domain && token) {
      try {
        if (
          !validateDnsRecord({
            ttl,
            recordType,
            recordValue,
            caaTag,
            caaValue,
            srvPort,
            srvPriority,
            srvWeight
          })
        ) {
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

      let processedRecordValue = recordValue;
      switch (recordType) {
        case 'CAA':
          processedRecordValue = `0 ${caaTag} "${caaValue}"`;
          break;
        default:
          break;
      }

      const recordData: {
        srv?: {
          [key: string]: string | number
        }
      } & {
        [key: string]: string | number
      } = {
        name: isSrv
          ? `${srvService ? `${srvService}.` : ''}${srvProtocol}.${recordName === '@' ? '' : recordName}`
          : recordName,
        ttl: ttl ?? 300,
        type: recordType
      };

      if (!isSrv) {
        recordData.value = processedRecordValue;
      }

      if (recordType === 'MX' && typeof mxPriority === 'number') {
        recordData.mxPriority = mxPriority;
      }

      if (isSrv) {
        recordData.srv = {
          port: srvPort!,
          priority: srvPriority!,
          target: srvTarget,
          weight: srvWeight!
        };
      }

      try {
        await fetcherWithAuthorization(
          [`/v2/domains/${domain}/records`, token],
          {
            method: 'post',
            mode: 'cors',
            credentials: 'include',
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
  }, [caaTag, caaValue, domain, isSrv, mutate, mxPriority, recordName, recordType, recordValue, router, setToast, srvPort, srvPriority, srvProtocol, srvService, srvTarget, srvWeight, token, ttl]);

  return (
    <div className="create-record-page">
      <BreadCrumb items={[
        { label: 'Domains', href: '/' },
        { id: 'dnspage', href: `/domain/${domain}`, label: domain ?? '. . .' },
        { id: 'create', label: 'Create Record' }
      ]} />
      <Text h1>Create Record</Text>

      <div>
        {domain && generateDnsDescription(
          domain,
          recordName,
          // eslint-disable-next-line no-nested-ternary
          recordType === 'CAA'
            ? `0 ${caaTag} ${caaValue}`
            : recordType === 'SRV'
              ? srvTarget
              : recordValue,
          recordType,
          isSrv && srvService,
          isSrv && srvProtocol,
          isSrv && srvPort,
          isSrv && srvTarget
        )}
      </div>
      <Spacer />
      <Grid.Container gap={2} justify="flex-start">
        <Grid xs={24} md={15}>
          <div className="form-item">
            <Input clearable labelRight={`.${domain}`} placeholder="subdomain" w="100%" {...recordNameBindings}>
              Record Name
            </Input>
            <Text p small my={0}>
              Keep blank or <Code>@</Code> to create a record for the root domain
            </Text>
          </div>
        </Grid>
        <Grid xs={24} md={9}>
          <div className="form-item">
            <Label label="Record Type">
              <Select
                placeholder="Record Type"
                className="select-type"
                value={recordType}
                onChange={(value) => {
                  if (typeof value === 'string') setRecordType(value as VercelSupportedDNSType);
                }}
              >
                {VERCEL_SUPPORTED_DNS_RECORDS_TYPE.map((recordType) => (
                  <Select.Option key={recordType} value={recordType}>{recordType}</Select.Option>
                ))}
              </Select>
            </Label>
          </div>
        </Grid>
        <Grid xs={24}>
          <div className="form-item">
            {recordValueInputNode}
          </div>
        </Grid>
        <Grid xs={24} md>
          <div className="form-item">
            <Input clearable value={ttl?.toString() ?? ''} placeholder="60" w="100%" onChange={setTtl}>
              TTL
            </Input>
          </div>
        </Grid>
        <Grid xs={24} md>
          <Label label="Preset TTL">
            <ButtonGroup margin={0} w="100%">
              <Button scale={2 / 3} onClick={() => setTtl(1 * 60)}>1 min</Button>
              <Button scale={2 / 3} onClick={() => setTtl(5 * 60)}>5 min</Button>
              <Button scale={2 / 3} onClick={() => setTtl(10 * 60)}>10 min</Button>
              <Button scale={2 / 3} onClick={() => setTtl(1 * 60 * 60)}>1 hour</Button>
              <Button scale={2 / 3} onClick={() => setTtl(5 * 60 * 60)}>5 hour</Button>
              <Button scale={2 / 3} onClick={() => setTtl(12 * 60 * 60)}>12 hour</Button>
              <Button scale={2 / 3} onClick={() => setTtl(24 * 60 * 60)}>1 day</Button>
            </ButtonGroup>
          </Label>
        </Grid>
      </Grid.Container>
      <Spacer h={2} />
      <div className="create-record-action">
        <Button
          disabled={readOnlyMode}
          type="success"
          loading={isSubmitting}
          onClick={readOnlyMode ? noop : handleSubmit}
        >
          {
            readOnlyMode
              ? 'You can\'t create record in read-only mode'
              : 'Create Record'
          }
        </Button>
      </div>
      <style jsx>{`
        .form-item {
          width: 100%;
        }
        .create-record-page :global(.with-label) {
          width: 100%;
        }
        .create-record-page :global(.select-type) {
          width: 100%;
        }
        .create-record-action {
          display: flex;
          justify-content: flex-end;
        }
        .create-record-page :global(.btn-group) {
          overflow-x: auto;
        }
        .create-record-page :global(.btn-group) :global(.btn) {
          flex-grow: 1;
        }
      `}</style>
    </div>
  );
};

CreateRecprdPage.getLayout = (children) => (
  <Layout>
    {children}
  </Layout>
);

export default CreateRecprdPage;
