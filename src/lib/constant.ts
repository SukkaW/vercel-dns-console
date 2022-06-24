export const LOCALSTORAGE_VERCEL_API_TOKEN_KEY = 'vercel-api-token';

export const VERCEL_SUPPORTED_DNS_RECORDS_TYPE = [
  'A',
  'AAAA',
  'ALIAS',
  'CAA',
  'CNAME',
  'MX',
  'SRV',
  'TXT',
  'NS'
] as const;
