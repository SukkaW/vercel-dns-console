import type { VercelPagination } from './pagination';

export interface VercelDomain {
  cdnEnabled: boolean;
  /** If the domain has the ownership verified. */
  verified: boolean
  /** A list of the current nameservers of the domain. */
  nameservers: string[]
  /** A list of the intended nameservers for the domain to point to Vercel DNS. */
  intendedNameservers: string[]
  /** A list of custom nameservers for the domain to point to. Only applies to domains purchased with Vercel. */
  customNameservers?: string[]
  /** An object containing information of the domain creator, including the user's id, username, and email. */
  creator: {
    username: string
    email: string
    customerId?: string | null
    isDomainReseller?: boolean
    id: string
  }
  /** The unique identifier of the domain. */
  id: string
  /** The domain name. */
  name: string
  /** Timestamp in milliseconds when the domain was created in the registry. */
  createdAt: number
  /** Timestamp in milliseconds at which the domain is set to expire. `null` if not bought with Vercel. */
  expiresAt: number | null
  /** If it was purchased through Vercel, the timestamp in milliseconds when it was purchased. */
  boughtAt: number | null
  /** Timestamp in milliseconds at which the domain was ordered. */
  orderedAt?: number
  /** Indicates whether the domain is set to automatically renew. */
  renew?: boolean
  /** The type of service the domain is handled by. `external` if the DNS is externally handled, `zeit.world` if handled with Vercel, or `na` if the service is not available. */
  serviceType: 'zeit.world' | 'external' | 'na'
  /** Timestamp in milliseconds at which the domain was successfully transferred into Vercel. `null` if the transfer is still processing or was never transferred in. */
  transferredAt?: number | null
  /** If transferred into Vercel, timestamp in milliseconds when the domain transfer was initiated. */
  transferStartedAt?: number
}

export interface VercelDomainResponse {
  domains: VercelDomain[],
  pagination: VercelPagination
}
