import { VercelPagination } from './pagination';

export interface VercelDNSRecord {
  id: string
  slug: string
  name: string
  type:
  | 'A'
  | 'AAAA'
  | 'ALIAS'
  | 'CAA'
  | 'CNAME'
  | 'MX'
  | 'SRV'
  | 'TXT'
  | 'NS'
  value: string
  mxPriority?: number
  priority?: number
  creator: string
  created: number | null
  updated: number | null
  createdAt: number | null
  updatedAt: number | null
}

export interface VercelDNSResponse {
  records: VercelDNSRecord[]
  pagination?: VercelPagination
}
