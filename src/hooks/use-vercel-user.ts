import useSWRImmutable from 'swr/immutable';
import { fetcherWithAuthorization, HTTPError } from '@/lib/fetcher';
import { useVercelApiToken } from './use-vercel-api-token';
import { useEffect, useMemo } from 'react';
import { useRouter } from 'next/router';

import type { VercelUserResponse } from '@/types/user';

export const useVercelUser = () => {
  const [token] = useVercelApiToken();
  const router = useRouter();

  const { data, error, isLoading, mutate } = useSWRImmutable<VercelUserResponse, HTTPError>(
    token ? ['/v2/user', token] : null,
    fetcherWithAuthorization,
    {
      onError(error) {
        if (error instanceof HTTPError) {
          if (error.status === 403) {
            // invalid token
            if (!router.pathname.startsWith('/login')) {
              router.push('/login');
            }
          }
        }
      },
      onErrorRetry(error, key, config, revalidate, { retryCount }) {
        // Never retry on 403
        if (error.status === 403) return;
        // retry up to 2 times
        if (retryCount >= 2) return;
        // Retry after 5 seconds
        setTimeout(() => revalidate({ retryCount }), 5000);
      }
    }
  );

  useEffect(() => {
    if (!token) {
      if (!router.pathname.startsWith('/login')) {
        router.push('/login');
      }
    }
  }, [token, router]);

  const newData = useMemo(() => {
    if (data) {
      return {
        username: data?.user.username,
        name: data?.user.name,
        avatar: data?.user.avatar
      };
    }

    return undefined;
  }, [data]);

  return {
    data: newData,
    error,
    mutate,
    isLoading
  };
};
