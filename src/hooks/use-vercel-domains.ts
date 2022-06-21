import useSWR from 'swr';
import { fetcherWithAuthorization, type HTTPError } from '../lib/fetcher';
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
