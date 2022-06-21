import { useCallback, useEffect, useRef, useState } from 'react';

import { useVercelApiToken } from '@/hooks/use-vercel-api-token';
import { useConstHandler } from '@/hooks/use-const-handler';
import { useVercelUser } from '@/hooks/use-vercel-user';
import { useRouter } from 'next/router';

import { Button, Card, Input, Link, Page, Spacer, Text, useToasts } from '@geist-ui/core';
import { NextPageWithLayout } from './_app';
import { fetcherWithAuthorization } from '../lib/fetcher';
import { VercelUserResponse } from '../types/user';

const LoginForm = () => {
  const [token, setToken] = useVercelApiToken();
  const [inputs, setInputs] = useState(token ?? '');

  const [isLoading, setIsLoading] = useState(false);
  const trimmed = inputs.trim();

  const router = useRouter();
  const { mutate } = useVercelUser();

  const { setToast: origSetToast, removeAll: origRemoveAllToasts } = useToasts();
  const setToast = useConstHandler(origSetToast);
  const removeAllToasts = useConstHandler(origRemoveAllToasts);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setInputs(e.target.value);
  }, []);

  const login = useConstHandler(async (token: string) => {
    const handleLoginError = () => {
      setIsLoading(false);
      setToken(null);

      setToast({
        type: 'error',
        text: 'Failed to login',
        delay: 3000
      });
    };

    try {
      setIsLoading(true);
      const resp = await fetcherWithAuthorization<VercelUserResponse>(['/v2/user', token]);
      if (resp && resp.user.id && resp.user.name && resp.user.username) {
        mutate(resp);
        setToken(token);

        setToast({
          type: 'success',
          text: `You are logged in as ${resp.user.name} (${resp.user.username})`,
          delay: 3000
        });

        router.push('/');
      } else {
        handleLoginError();
      }
    } catch {
      handleLoginError();
    }
  });

  const tokenRef = useRef(token);

  useEffect(() => {
    if (tokenRef.current) {
      login(tokenRef.current);

      return () => {
        removeAllToasts();
      };
    }
  }, [login, removeAllToasts]);

  const handleClick = useCallback(() => {
    login(trimmed);
  }, [trimmed, login]);

  return (
    <div className="login-form">
      <style jsx>
        {`
          .login-form {
            display: flex;
            flex-direction: column;
            align-items: baseline;
            flex-wrap: wrap;
          }
        `}
      </style>
      <Input
        value={inputs}
        width="100%"
        placeholder="Paste your API token here"
        onChange={handleInputChange}
      >
        <Text small>
          You can generate your API token by visiting{' '}
          <Link
            href="https://vercel.com/account/tokens"
            target="_blank"
            rel="external nofollow noreferrer noopenner"
            icon
            color
          >
            https://vercel.com/account/tokens
          </Link>
        </Text>
      </Input>
      <Spacer />
      <Button
        scale={9 / 10}
        type="secondary-light"
        w="100%"
        onClick={handleClick}
        loading={isLoading}
        disabled={inputs.trim().length === 0}
      >
        Continue with Your API Token
      </Button>
      <Spacer />
      <Card>
        This is an <strong>Unofficial</strong> control panel for
        {' '}
        <Link
          href="https://vercel.com"
          target="_blank"
          rel="external nofollow noreferrer noopenner"
          icon
          color
        >
          Vercel
        </Link>.
        {' '}
        Your API token will only be stored in your browser locally.
      </Card>
    </div>
  );
};

const Login: NextPageWithLayout = () => {
  return (
    <div className="root">
      <style jsx>
        {`
          .root {
            display: flex;
            justify-content: center;
            height: calc(100vh - 100px);
          }

          .login {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
          }
        `}
      </style>
      <div className="login">
        <Text h3>
          Log in to Vercel DNS
        </Text>
        <LoginForm />
      </div>
    </div>
  );
};

Login.getLayout = (children, props) => (
  <Page>
    <Page.Content>
      {children}
    </Page.Content>
  </Page>
);

export default Login;
