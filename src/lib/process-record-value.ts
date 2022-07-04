import type { DNSFormState } from '../components/edit-dns-record';

export const processRecordValue = (
  {
    caaTag,
    caaValue,
    recordType,
    recordValue
  }: DNSFormState
): string => {
  let processedRecordValue = recordValue;
  switch (recordType) {
    case 'CAA': {
      const quotedCaaValue = (!caaValue.startsWith('"') || !caaValue.endsWith('"'))
        ? `"${caaValue}"`
        : caaValue;
      processedRecordValue = `0 ${caaTag} ${quotedCaaValue}`;
      break;
    }
    default:
      break;
  }

  return processedRecordValue;
};

type RecordData = {
  srv?: RecordData
} & {
  [key: string]: string | number
};

export const getRecordData = (
  {
    recordName,
    ttl,
    recordType,
    srvService,
    srvProtocol,
    srvPort,
    srvWeight,
    srvPriority,
    srvTarget,
    mxPriority
  }: DNSFormState,
  processedRecordValue: string
): RecordData => {
  const recordData: RecordData = {
    name: recordType === 'SRV'
      ? `${srvService ? `${srvService}.` : ''}${srvProtocol}.${recordName === '@' ? '' : recordName}`
      : recordName,
    ttl: ttl ?? 300,
    type: recordType
  };

  if (recordType !== 'SRV') {
    recordData.value = processedRecordValue;
  } else {
    recordData.srv = {
      port: srvPort!,
      priority: srvPriority!,
      target: srvTarget,
      weight: srvWeight!
    };
  }

  if (recordType === 'MX' && typeof mxPriority === 'number') {
    recordData.mxPriority = mxPriority;
  }

  return recordData;
};
