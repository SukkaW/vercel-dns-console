import { useToasts } from '@geist-ui/core';
import { useMemo } from 'react';
import useSWR from 'swr';
import { fetcherWithAuthorization, HTTPError } from '../lib/fetcher';
import type { VercelDomainResponse } from '../types/domains';
import { isVercelError } from '../types/error';

import { useVercelApiToken } from './use-vercel-api-token';

export const useVercelDomains = () => {
  const [token] = useVercelApiToken();
  const { setToast } = useToasts();

  return useSWR<VercelDomainResponse, HTTPError>(
    token
      ? ['/v5/domains', token]
      : null,
    fetcherWithAuthorization,
    {
      onError(error) {
        let errorMessage = 'Failed to load domains list';

        if (error instanceof HTTPError) {
          if (isVercelError(error.info)) {
            errorMessage += `: ${error.info.error.message}`;
          }
        }

        setToast({
          type: 'error',
          text: errorMessage,
          delay: 3000
        });
      }
    }
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
