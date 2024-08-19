import { useEffect, useMemo, useRef } from 'react';

import useSWRImmutable from 'swr/immutable';
import { fetcherWithAuthorization, HTTPError } from '@/lib/fetcher';
import { useVercelApiToken } from './use-vercel-api-token';
import { useRouter } from 'next/router';
import { useToasts } from './use-toasts';

import type { VercelUserResponse } from '@/types/user';

export const useVercelUser = () => {
  const [token, setToken] = useVercelApiToken();
  const { setToast } = useToasts();
  const router = useRouter();

  const { data, error, isLoading, mutate } = useSWRImmutable<VercelUserResponse, HTTPError>(
    token ? ['/v2/user', token] : null,
    fetcherWithAuthorization,
    {
      onError(error) {
        if (error instanceof HTTPError) {
          if (error.status === 403) {
            // invalid token
            setToken(null);
            setToast({
              type: 'error',
              text: 'Invalid API token',
              delay: 3000
            });
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

  // only check if token is exists for once
  // the token will set to null if token becomes invalid (E.g. revoked)
  const missingInitialToken = useRef(!token);
  useEffect(() => {
    if (missingInitialToken.current) {
      if (!router.pathname.startsWith('/login')) {
        router.push('/login');
      }
    }
  }, [router]);

  const newData = useMemo(() => {
    if (data) {
      return {
        username: data.user.username,
        name: data.user.name,
        avatar: data.user.avatar
      };
    }
  }, [data]);

  return {
    data: newData,
    error,
    mutate,
    isLoading
  };
};
