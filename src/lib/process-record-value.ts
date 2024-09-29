import type { DNSFormState } from '../components/edit-dns-record';

const processRecordValue = (
  {
    caaTag,
    caaValue,
    recordType,
    recordValue
  }: DNSFormState
): string => {
  // eslint-disable-next-line sukka/no-small-switch -- there will be more cases in the future
  switch (recordType) {
    case 'CAA': {
      const quotedCaaValue = (!caaValue.startsWith('"') || !caaValue.endsWith('"'))
        ? `"${caaValue}"`
        : caaValue;
      return `0 ${caaTag} ${quotedCaaValue}`;
    }
    default:
      break;
  }

  return recordValue;
};

type RecordData = {
  srv?: RecordData
} & {
  [key: string]: string | number
};

export const getRecordData = (
  recordInfo: DNSFormState
): RecordData => {
  const {
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
  } = recordInfo;
  const processedRecordValue = processRecordValue(recordInfo);
  const recordData: RecordData = {
    name: recordType === 'SRV'
      ? `${srvService ? `${srvService}.` : ''}${srvProtocol}.${recordName === '@' ? '' : recordName}`
      : recordName,
    ttl: ttl ?? 300,
    type: recordType
  };

  if (recordType === 'SRV') {
    recordData.srv = {
      port: srvPort!,
      priority: srvPriority!,
      target: srvTarget,
      weight: srvWeight!
    };
  } else {
    recordData.value = processedRecordValue;
  }

  if (recordType === 'MX' && typeof mxPriority === 'number') {
    recordData.mxPriority = mxPriority;
  }

  return recordData;
};
