/* eslint-disable no-nested-ternary */
import { Text } from '@geist-ui/core';
import type React from 'react';

export const generateDnsDescription = (
  domain: string,
  name: string | null | undefined,
  value: string | null | undefined,
  type:
  | 'A'
  | 'AAAA'
  | 'ALIAS'
  | 'CAA'
  | 'CNAME'
  | 'MX'
  | 'SRV'
  | 'TXT'
  | 'NS',
  srvService?: string | null | undefined,
  srvProtocol?: '_tcp' | '_udp' | '_tls' | null | undefined,
  srvPort?: number | null | undefined,
  srvTarget?: string | null | undefined
): React.ReactNode => {
  const nameNode = typeof name === 'string' ? <Text b>{name === '@' || name === '' ? '' : `${name}.`}{domain}</Text> : <Text type="secondary" span>[name]</Text>;
  const valueNode = value
    ? <Text b>{value}</Text>
    : <Text type="secondary" span>[value]</Text>;

  switch (type) {
    case 'A':
      return (
        <>
          {nameNode} points to an IPv4 address: {valueNode}
        </>
      );
    case 'AAAA':
      return (
        <>
          {nameNode} points to an IPv6 address: {valueNode}
        </>
      );
    case 'CAA': {
      const caaValue = value ? value.split(' ') : [];
      const caTag = caaValue[1];
      const caValue = caaValue[2];
      return (
        <>
          CA {
            caValue
              ? <Text b>{caValue}</Text>
              : <Text type="secondary" span>[value]</Text>
          } can issue certificates for {nameNode} and {
            caTag === 'issue'
              ? <Text b>only allows specific hostnames</Text>
              : caTag === 'issuewild'
                ? <Text b>only allows wildcards</Text>
                : caTag === 'iodef'
                  ? <Text b>sends violation reports to URL (http:, https:, or mailto:)</Text>
                  : <Text type="secondary" span>[tag]</Text>
          }
        </>
      );
    }
    case 'CNAME':
      return (
        <>
          {nameNode} is an alias of {valueNode}
        </>
      );
    case 'ALIAS':
      return (
        <>
          {nameNode} is an alias of {valueNode} that returns its IPv4/IPv6 address directly
        </>
      );
    case 'MX':
      return (
        <>
          Mailserver {valueNode} handles mail for {nameNode}
        </>
      );
    case 'NS':
      return (
        <>
          {nameNode} is managed by {valueNode}
        </>
      );
    case 'SRV': {
      if (srvPort || srvTarget || srvService || srvProtocol) {
        const serviceNode = srvService
          ? <Text b>{srvService}</Text>
          : <Text type="secondary" span>[service]</Text>;

        const domainNode = srvProtocol && name && srvService
          ? <Text b>
            {`${srvService}.${srvProtocol}.${srvService}.${name === '@' || name === '' ? '' : `${name}.`}`}{domain}
          </Text>
          : <Text type="secondary" span>
            {`${srvService}.${srvProtocol}.${srvService}.${name === '@' || name === '' ? '' : `${name}.`}`}{domain}
          </Text>;

        const srvTargetNode = srvTarget
          ? <Text b>{srvTarget}</Text>
          : <Text type="secondary" span>[target]</Text>;

        const srvPortNode = srvPort
          ? <Text b>{srvPort}</Text>
          : <Text type="secondary" span>[port]</Text>;

        return (
          <>
            {domainNode} is points to {srvTargetNode} and listens on <Text b>{srvProtocol}</Text> port {srvPortNode} for service {serviceNode}
          </>
        );
      }
      return (
        <>
          {nameNode} is points to service: {valueNode}
        </>
      );
    }
    case 'TXT':
      return (
        <>
          {nameNode} is has a record with text content {valueNode}
        </>
      );
    default:
      return (
        <>
          {nameNode} points to {valueNode}
        </>
      );
  }
};
