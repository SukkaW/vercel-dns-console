import { Code, Text } from '@geist-ui/core';
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
  srvService?: string | null | undefined | false,
  srvProtocol?: '_tcp' | '_udp' | '_tls' | null | undefined | false,
  srvPort?: number | null | undefined | false,
  srvTarget?: string | null | undefined | false
): React.ReactNode => {
  const nameNode = typeof name === 'string' ? <Text b>{name === '@' || name === '' ? '' : `${name}.`}{domain}</Text> : <Text type="secondary" span>[name]</Text>;
  const valueNode = value
    ? <Text b>{value}</Text>
    : <Text type="secondary" span>[value]</Text>;
  const valueWithDefault = value || '[value]';

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

      if (caTag === 'issue' || caTag === 'issuewild') {
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

      if (caTag === 'iodef') {
        return (
          <>
            CA should send reports to URL {
              caValue
                ? <Text b>{caValue}</Text>
                : <Text type="secondary" span>[value]</Text>
            } when there is an issue request that violates {nameNode}{'\''}s certificate policy.
          </>
        );
      }

      return (
        <>
          {nameNode} has a CAA value of <Code>{valueWithDefault}</Code>
        </>
      );
    }
    case 'CNAME':
      return (
        <>
          {nameNode} is an alias of <Code>{valueWithDefault}</Code>
        </>
      );
    case 'ALIAS':
      return (
        <>
          {nameNode} is an alias of <Code>{valueWithDefault}</Code> that returns its IPv4/IPv6 address directly
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
          ? (
            <Text b>
              {serviceNode}
              {`.${srvProtocol}.${name === '@' || name === '' ? '' : `${name}.`}`}{domain}
            </Text>
          )
          : (
            <Text type="secondary" span>
              {serviceNode}
              {`.${srvProtocol ?? ''}.${name === '@' || name === '' ? '' : `${name ?? ''}.`}`}{domain}
            </Text>
          );

        const srvTargetNode = srvTarget
          ? <Text b>{srvTarget}</Text>
          : <Text type="secondary" span>[target]</Text>;

        const srvPortNode = srvPort
          ? <Text b>{srvPort}</Text>
          : <Text type="secondary" span>[port]</Text>;

        const formatSrvProtocol = srvProtocol === '_tcp' ? 'TCP' : srvProtocol === '_udp' ? 'UDP' : srvProtocol === '_tls' ? 'TLS' : srvProtocol;

        return (
          <>
            {domainNode} points to {srvTargetNode} and listens on <Text b>{formatSrvProtocol}</Text> port {srvPortNode} for service {serviceNode}
          </>
        );
      }
      return (
        <>
          {nameNode} points to service: {valueNode}
        </>
      );
    }
    case 'TXT':
      return (
        <>
          {nameNode} has a record with text content <Code>{valueWithDefault}</Code>
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
