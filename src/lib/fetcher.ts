export class HTTPError extends Error {
  info: unknown;
  status: number;
  constructor(message: string, info: unknown, status: number) {
    super(message);
    this.info = info;
    this.status = status;
  }
}

export const fetcherWithAuthorization = async ([key, token]: [string, string]) => {
  const res = await fetch(
    new URL(key, 'https://api.vercel.com/').toString(),
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );
  if (!res.ok) {
    // Attach extra info to the error object.
    const error = new HTTPError('An error occurred while fetching the data.', await res.json(), res.status);
    throw error;
  }
  return res.json();
};
