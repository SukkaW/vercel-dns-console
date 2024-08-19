import useSWRInfinite from 'swr/infinite';
import { fetcherWithAuthorization } from '../lib/fetcher';
import { useVercelApiToken } from './use-vercel-api-token';

import type { SWRInfiniteConfiguration } from 'swr/infinite';
import type { VercelDNSResponse } from '../types/dns';

export const useVercelDNSRecords = (domain: string | undefined, config?: SWRInfiniteConfiguration<VercelDNSResponse>) => {
  const [token] = useVercelApiToken();
  return useSWRInfinite<VercelDNSResponse>(
    (pageIndex, previousData) => {
      if (!domain) return null;
      // reached the end
      if (previousData) {
        if (!previousData.pagination) return null;
        if (!previousData.pagination.next) return null;
      }
      // first page, we don't have `previousPageData`
      if (pageIndex === 0) return [`/v4/domains/${domain}/records?limit=50`, token];
      return [`/v4/domains/${domain}/records?limit=50&until=${previousData?.pagination?.next}`, token];
    },
    fetcherWithAuthorization,
    {
      ...config,
      // Make sure we will fetch all records at once
      // SWR hook will break early if getKey return null so there is no performance impact
      initialSize: 1_919_810_114_514
    }
  );
};
