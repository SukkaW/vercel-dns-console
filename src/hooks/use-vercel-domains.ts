import { useMemo } from 'react';
import useSWR from 'swr';
import { fetcherWithAuthorization, HTTPError } from '../lib/fetcher';
import { VercelDomainResponse } from '../types/domains';
import { useVercelApiToken } from './use-vercel-api-token';

export const useVercelDomains = () => {
  const [token] = useVercelApiToken();

  return useSWR<VercelDomainResponse, HTTPError>(
    token
      ? ['/v5/domains', token]
      : null,
    fetcherWithAuthorization
  );
};

export const useVercelDomainInfo = (domain: string | undefined) => {
  const { data } = useVercelDomains();

  return useMemo(() => {
    if (data) {
      return data.domains.find((d) => d.name === domain);
    }

    return undefined;
  }, [data, domain]);
};
