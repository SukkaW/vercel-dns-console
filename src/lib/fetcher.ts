export class HTTPError extends Error {
  info: unknown;
  status: number;
  name = 'HTTPError';
  constructor(message: string, info: unknown, status: number) {
    super(message);
    this.info = info;
    this.status = status;
  }
}

export async function fetcherWithAuthorization<T>([key, token]: [string, string], options?: RequestInit): Promise<T> {
  const headers = new Headers({
    Authorization: `Bearer ${token}`
  });

  if (options?.headers) {
    const incomingHeaders = new Headers(options.headers);
    incomingHeaders.forEach((value, key) => headers.append(key, value));
  }

  const res = await fetch(
    new URL(key, 'https://api.vercel.com/'),
    { ...options, headers }
  );

  const data = res.headers.get('content-type')?.includes('application/json')
    ? await res.json()
    : await res.text();

  if (!res.ok) {
    // Attach extra info to the error object.
    throw new HTTPError('An error occurred while fetching the data.', data, res.status);
  }
  return data;
}
