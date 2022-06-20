import useSWR from 'swr';
import { fetcherWithAuthorization, HTTPError } from '@/lib/fetcher';
import { useVercelApiToken } from './use-vercel-api-token';
import { useEffect } from 'react';
import { useRouter } from 'next/router';

export interface User {
  id: string;
  avatar: string;
  createdAt: number;
  email: string;
  username: string;
  name?: string;
  limited?: boolean;
}

interface UserResponse {
  user: User;
}

export const useVercelUser = () => {
  const [token, setToken] = useVercelApiToken();

  const { data, error, isLoading } = useSWR<UserResponse, HTTPError>(
    token ? ['/v2/user', token] : null,
    fetcherWithAuthorization,
    {
      onErrorRetry: (error, key, config, revalidate, { retryCount }) => {
        // Never retry on 403
        if (error.status === 403) return;
        // retry up to 2 times
        if (retryCount >= 2) return;
        // Retry after 5 seconds
        setTimeout(() => revalidate({ retryCount }), 5000);
      }
    }
  );

  const isNotLoggedIn = !token || (error && error.status === 403);
  const router = useRouter();

  useEffect(() => {
    if (isNotLoggedIn) {
      setToken(null);
      if (!router.pathname.startsWith('/login')) {
        router.push('/login');
      }
    }
  });

  return {
    data: data
      ? {
        username: data.user.username,
        name: data.user.name,
        avatar: data.user.avatar
      }
      : undefined,
    error,
    isNotLoggedIn,
    isLoading
  };
};
