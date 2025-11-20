import type { NextRequest } from 'next/server';

function handler(req: NextRequest) {
  const method = req.method.toUpperCase();

  if (method === 'GET') {
    return new Response(null, { status: 204 });
  }

  const headers = new Headers();

  const origin = req.headers.get('origin');
  if (origin) {
    headers.append('Access-Control-Allow-Origin', origin);
    headers.append('Access-Control-Allow-Credentials', 'true');
  }

  if (method === 'OPTIONS') {
    // preflight
    if (origin) {
      headers.append('Access-Control-Allow-Methods', 'POST, OPTIONS');
    }

    return new Response(null, {
      status: 204,
      headers
    });
  }

  if (method === 'POST') {
    headers.append('Content-Type', 'application/json');
    return new Response('{}', {
      headers
    });
  }

  return new Response(null, { status: 405 });
}

export default handler;

export const config = {
  runtime: 'experimental-edge'
};
