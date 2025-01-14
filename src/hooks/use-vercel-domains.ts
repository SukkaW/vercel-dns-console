import { useToasts } from '@geist-ui/core';
import { useMemo } from 'react';
import useSWR from 'swr';
import { fetcherWithAuthorization, HTTPError } from '../lib/fetcher';
import type { VercelDomainResponse } from '../types/domains';
import { isVercelError } from '../types/error';

import { useVercelApiToken } from './use-vercel-api-token';
import { useVercelUser } from './use-vercel-user';

export function useVercelDomains(teamId: string | undefined) {
  const [token] = useVercelApiToken();
  const { setToast } = useToasts();

  return useSWR<VercelDomainResponse, HTTPError>(
    token && teamId
      ? ['/v6/domains?teamId=' + teamId, token]
      : null,
    fetcherWithAuthorization,
    {
      onError(error) {
        let errorMessage = 'Failed to load domains list';

        if (error instanceof HTTPError && isVercelError(error.info)) {
          errorMessage += `: ${error.info.error.message}`;
        }

        setToast({
          type: 'error',
          text: errorMessage,
          delay: 3000
        });
      }
    }
  );
}

export function useVercelDomainInfo(domain: string | undefined) {
  // TODO: filter multiple teams
  const { data: user } = useVercelUser();

  const { data } = useVercelDomains(user?.defaultTeamId);

  return useMemo(() => {
    if (data) {
      return data.domains.find((d) => d.name === domain);
    }
  }, [data, domain]);
}
