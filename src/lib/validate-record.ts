import { VERCEL_SUPPORTED_DNS_RECORDS_TYPE } from './constant';
import { isIPv4, isIPv6 } from 'is-ip';
import type { DNSFormState } from '../components/edit-dns-record';

const validCaaTag = new Set(['issue', 'issuewild', 'iodef']);

const isInteger = (value: unknown): boolean => {
  if (typeof value !== 'number') return false;
  if (!Number.isInteger(value)) return false;
  return true;
};

export const validateDnsRecord = ({
  recordType,
  recordValue,
  caaTag,
  caaValue,
  mxPriority,
  srvPort,
  srvWeight,
  srvPriority
}: DNSFormState): boolean => {
  if (!VERCEL_SUPPORTED_DNS_RECORDS_TYPE.includes(recordType)) throw `"${recordType}" is not a supported DNS type`;

  if (recordType === 'SRV') {
    if (!srvPort) throw 'Missing SRV port';
    if (!isInteger(srvPort)) throw 'Invalid SRV port';
    if (!srvWeight) throw 'Missing SRV weight';
    if (!isInteger(srvWeight)) throw 'Invalid SRV weight';
    if (!srvPriority) throw 'Missing SRV priority';
    if (!isInteger(srvPriority)) throw 'Invalid SRV priority';
  } else if (recordType === 'CAA') {
    if (!validCaaTag.has(caaTag)) throw `Invalid CAA tag "${caaTag}"`;
    if (!caaValue) throw 'Missing CAA value';
  } else {
    if (!recordValue) throw 'Missing record value';

    switch (recordType) {
      case 'MX': {
        if (!mxPriority) throw 'Missing MX priority';
        if (!isInteger(mxPriority)) throw 'Invalid MX priority';

        break;
      }
      case 'A': {
        if (!isIPv4(recordValue)) throw `"${recordValue}" is not an valid IPv4 address`;

        break;
      }
      case 'AAAA': {
        if (!isIPv6(recordValue)) throw `"${recordValue}" is not an valid IPv6 address`;

        break;
      }
      default: {
        break;
      }
    // No default
    }
  }

  return true;
};
