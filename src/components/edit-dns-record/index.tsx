import { useState, useCallback, useMemo } from 'react';

import { useInput, Grid, Input, Select, Text, Textarea, Spacer, Code, ButtonGroup, Button, Loading } from '@geist-ui/core';
import { useReadonlyMode } from '@/hooks/use-readonly-mode';
import { useInputNumberState } from '@/hooks/use-input-number-state';

import { VERCEL_SUPPORTED_DNS_RECORDS_TYPE } from '@/lib/constant';
import { generateDnsDescription } from '@/lib/generate-dns-description';
import { noop } from '@/lib/util';
import type { VercelSupportedDNSType } from '@/types/dns';
import { Label } from '../create-record/label';

type CAATag = 'issue' | 'issuewild' | 'iodef';
type SrvProtocol = '_tcp' | '_udp' | '_tls';

export interface DNSFormState {
  ttl: number | null,
  recordType: VercelSupportedDNSType,
  recordName: string,
  recordValue: string,
  caaTag: CAATag,
  caaValue: string,
  srvPort: number | null,
  srvPriority: number | null,
  srvWeight: number | null,
  srvTarget: string,
  srvService: string,
  srvProtocol: SrvProtocol
  mxPriority: number | null
}

export type OnSubmit = (arg: DNSFormState) => void | Promise<void>;

export interface EditDNSRecordProps {
  domain: string | undefined;
  isSubmitting: boolean;
  onSubmit: OnSubmit;
  isEdit?: boolean;
  initialState?: DNSFormState | null;
}

const getRecordValuePlaceHolder = (recordType: VercelSupportedDNSType) => {
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
};

export const EditDNSRecord = ({
  domain,
  isSubmitting,
  onSubmit,
  initialState,
  isEdit = false
}: EditDNSRecordProps) => {
  const [readOnlyMode] = useReadonlyMode();

  const isInitialStateLoading = isEdit && !initialState;

  const { state: recordName, bindings: recordNameBindings } = useInput(initialState?.recordName ?? '');
  const [recordType, setRecordType] = useState<VercelSupportedDNSType>(initialState?.recordType ?? 'A');
  const isSrv = recordType === 'SRV';

  const { state: recordValue, bindings: recordValueBindings } = useInput(initialState?.recordValue ?? '');

  const [caaTag, setCaaTag] = useState<CAATag>(initialState?.caaTag ?? 'issue');
  const handleSelectCaaTag = useCallback((value: string | string[]) => {
    if (typeof value === 'string') {
      setCaaTag(value as CAATag);
    }
  }, []);

  const { state: caaValue, bindings: caaValueBindings } = useInput(initialState?.caaValue ?? '');
  const { state: srvService, bindings: srvServiceBindings } = useInput('');

  const [srvProtocol, setSrvProtocol] = useState<SrvProtocol>('_tcp');
  const handleSelectSrvProtocol = useCallback((value: string | string[]) => {
    if (typeof value === 'string') {
      setSrvProtocol(value as SrvProtocol);
    }
  }, []);

  const [mxPriority, setMxPriority] = useInputNumberState(initialState?.mxPriority ?? null);

  const { state: srvTarget, bindings: srvTargetBindings } = useInput(initialState?.srvTarget ?? '');
  const [srvPort, setSrvPort] = useInputNumberState(initialState?.srvPort ?? null);
  const [srvPriority, setSrvPriority] = useInputNumberState(initialState?.srvPriority ?? null);
  const [srvWeight, setSrvWeight] = useInputNumberState(initialState?.srvWeight ?? null);

  const [ttl, setTtl] = useInputNumberState(initialState?.ttl ?? null);

  const recordValuePlaceHolder = useMemo(() => getRecordValuePlaceHolder(recordType), [recordType]);

  const recordValueInputNode = useMemo(() => {
    if (recordType === 'MX') {
      return (
        <Grid.Container gap={2} justify="flex-start">
          <Grid xs={15}>
            <Input
              disabled={isInitialStateLoading}
              clearable
              placeholder={recordValuePlaceHolder}
              w="100%"
              {...recordValueBindings}
            >
              Record Value
            </Input>
          </Grid>
          <Grid xs={9}>
            <Input
              inputMode="numeric"
              htmlType="number"
              disabled={isInitialStateLoading}
              clearable
              placeholder="10"
              w="100%"
              value={mxPriority?.toString() ?? ''}
              onChange={setMxPriority}
            >
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
            <Input
              disabled={isEdit}
              clearable
              placeholder="_servicename"
              w="100%"
              {...srvServiceBindings}
            >
              Service Name
            </Input>
          </Grid>
          <Grid xs={12} md={5}>
            <Label label="Protocol">
              <Select
                disabled={isEdit}
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
            <Input
              inputMode="numeric"
              htmlType="number"
              disabled={isInitialStateLoading}
              clearable
              placeholder="10"
              w="100%"
              value={srvPriority?.toString() ?? ''}
              onChange={setSrvPriority}
            >
              Priority
            </Input>
          </Grid>
          <Grid xs={12} md={4}>
            <Input
              inputMode="numeric"
              htmlType="number"
              clearable
              placeholder="0"
              w="100%"
              value={srvWeight?.toString() ?? ''}
              onChange={setSrvWeight}
            >
              Weight
            </Input>
          </Grid>
          <Grid xs={12} md={4}>
            <Input
              inputMode="numeric"
              htmlType="number"
              disabled={isInitialStateLoading}
              clearable
              placeholder="0"
              w="100%"
              value={srvPort?.toString() ?? ''}
              onChange={setSrvPort}
            >
              Port
            </Input>
          </Grid>
          <Grid xs={24}>
            <Input
              disabled={isInitialStateLoading}
              clearable
              placeholder="_servicename.example.com"
              w="100%"
              {...srvTargetBindings}
            >
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
                disabled={isInitialStateLoading}
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
            <Input
              clearable
              disabled={isInitialStateLoading}
              placeholder={
                caaTag === 'iodef'
                  ? 'http:, https:, or mailto:'
                  : 'letsencrypt.org'
              }
              w="100%"
              {...caaValueBindings}
            >
              {caaTag === 'iodef' ? 'Report URL' : 'CA Domain Name'}
            </Input>
          </Grid>
        </Grid.Container>
      );
    }

    if (recordType === 'TXT') {
      return (
        <Label label="Record Value">
          <Textarea
            disabled={isInitialStateLoading}
            placeholder={recordValuePlaceHolder}
            h={4}
            width="100%"
            resize="vertical"
            {...recordValueBindings}
          />
        </Label>
      );
    }

    return (
      <Input
        disabled={isInitialStateLoading}
        clearable
        placeholder={recordValuePlaceHolder}
        w="100%"
        {...recordValueBindings}
      >
        Record Value
      </Input>
    );
  }, [caaTag, caaValueBindings, handleSelectCaaTag, handleSelectSrvProtocol, isEdit, isInitialStateLoading, mxPriority, recordType, recordValueBindings, recordValuePlaceHolder, setMxPriority, setSrvPort, setSrvPriority, setSrvWeight, srvPort, srvPriority, srvProtocol, srvServiceBindings, srvTargetBindings, srvWeight]);

  const handleSubmit = useCallback(() => {
    onSubmit({
      ttl,
      recordName,
      recordType,
      recordValue,
      mxPriority,
      srvProtocol,
      srvService,
      srvTarget,
      srvPort,
      srvPriority,
      srvWeight,
      caaTag,
      caaValue
    });
  }, [caaTag, caaValue, mxPriority, onSubmit, recordName, recordType, recordValue, srvPort, srvPriority, srvProtocol, srvService, srvTarget, srvWeight, ttl]);

  return (
    <div className="edit-record">
      <div>
        {domain && !isInitialStateLoading
          ? generateDnsDescription(
            domain,
            recordName,
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
          )
          : <Loading className="dns-descr-loading">Loading</Loading>}
      </div>
      <Spacer />
      <Grid.Container gap={2} justify="flex-start">
        <Grid xs={24} md={15}>
          <div className="form-item">
            <Input
              disabled={isInitialStateLoading || !domain}
              clearable
              labelRight={domain ? `.${domain}` : undefined}
              placeholder="subdomain"
              w="100%"
              {...recordNameBindings}
            >
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
                disabled={isEdit}
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
            <Input
              inputMode="numeric"
              htmlType="number"
              clearable
              disabled={isInitialStateLoading}
              value={ttl?.toString() ?? ''}
              placeholder="300"
              w="100%"
              onChange={setTtl}
            >
              TTL
            </Input>
          </div>
        </Grid>
        <Grid xs={24} md>
          <Label label="Preset TTL">
            {
              useMemo(() => (
                <ButtonGroup margin={0} w="100%">
                  <TtlButton ttl={1 * 60} disabled={isInitialStateLoading} onChange={setTtl}>1 min</TtlButton>
                  <TtlButton ttl={5 * 60} disabled={isInitialStateLoading} onChange={setTtl}>5 min</TtlButton>
                  <TtlButton ttl={10 * 60} disabled={isInitialStateLoading} onChange={setTtl}>10 min</TtlButton>
                  <TtlButton ttl={1 * 60 * 60} disabled={isInitialStateLoading} onChange={setTtl}>1 hour</TtlButton>
                  <TtlButton ttl={5 * 60 * 60} disabled={isInitialStateLoading} onChange={setTtl}>5 hour</TtlButton>
                  <TtlButton ttl={12 * 60 * 60} disabled={isInitialStateLoading} onChange={setTtl}>12 hour</TtlButton>
                  <TtlButton ttl={24 * 60 * 60} disabled={isInitialStateLoading} onChange={setTtl}>1 day</TtlButton>
                </ButtonGroup>
              ), [isInitialStateLoading, setTtl])
            }
          </Label>
        </Grid>
      </Grid.Container>
      <Spacer h={2} />
      <div className="create-record-action">
        <Button
          disabled={readOnlyMode || isInitialStateLoading}
          type="success"
          loading={isSubmitting}
          onClick={readOnlyMode ? noop : handleSubmit}
        >
          {
            readOnlyMode
              ? 'You can\'t create record in read-only mode'
              : isEdit
                ? 'Update Record'
                : 'Create Record'
          }
        </Button>
      </div>
      <style jsx>{`
        .form-item {
          width: 100%;
        }
        div.edit-record :global(.with-label) {
          width: 100%;
        }
        div.edit-record :global(.select-type) {
          width: 100%;
        }
        div.edit-record :global(.dns-descr-loading .loading) {
          justify-content: flex-start;
        }
        .create-record-action {
          display: flex;
          justify-content: flex-end;
        }
        div.edit-record :global(.btn-group) {
          overflow-x: auto;
        }
        div.edit-record :global(.btn-group) :global(.btn) {
          flex-grow: 1;
        }
      `}</style>
    </div>
  );
};

function TtlButton(props: {
  onChange: (ttl: number) => void,
  ttl: number,
  disabled?: boolean,
  children: React.ReactNode
}) {
  return (
    <Button disabled={props.disabled} scale={2 / 3} onClick={() => props.onChange(props.ttl)}>{props.children}</Button>
  );
}
