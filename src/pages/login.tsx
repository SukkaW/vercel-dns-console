import { useCallback, useEffect, useState } from 'react';

import { useStyletron } from 'baseui';
import { Heading, HeadingLevel } from 'baseui/heading';
import { Input } from 'baseui/input';
import { FormControl } from 'baseui/form-control';
import { Button } from 'baseui/button';
import { StyledLink } from 'baseui/link';
import {
  Card,
  StyledBody
} from 'baseui/card';
import { Block } from 'baseui/block';
import { toaster } from 'baseui/toast';

import { useVercelApiToken } from '@/hooks/use-vercel-api-token';
import { useConstHandler } from '@/hooks/use-const-handler';
import { useVercelUser } from '@/hooks/use-vercel-user';
import { useRouter } from 'next/router';
import { useSWRConfig } from 'swr';

const LoginForm = () => {
  const { mutate } = useSWRConfig();
  const [inputs, setInputs] = useState('');
  const trimmed = inputs.trim();

  const [, setToken] = useVercelApiToken();
  const router = useRouter();
  const { data, error, isLoading } = useVercelUser();

  useEffect(() => {
    if (data && data.name && data.username) {
      toaster.positive(
        (
          <Block>
            You are logged in as {data.name} ({data.username})
          </Block>
        ), {}
      );

      const timerId = setTimeout(() => {
        router.push('/');
      }, 2000);

      return () => {
        clearTimeout(timerId);
        toaster.clear();
      };
    }
    if (error) {
      toaster.negative((
        <Block>
          Failed to login
        </Block>
      ), {});

      return () => {
        toaster.clear();
      };
    }
  }, [data, error, router]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setInputs(e.target.value);
  }, []);

  const handleClick = useConstHandler(() => {
    if (trimmed.length > 0) {
      setToken(trimmed);
      mutate('/v2/user');
    }
  });

  return (
    <div>
      <FormControl
        label={'Your Vercel API Token'}
        caption={(
          <>
            {'You can generate your API token by visiting '}
            <StyledLink href="https://vercel.com/account/tokens">https://vercel.com/account/tokens</StyledLink>
          </>
        )}
      >
        <Input
          value={inputs}
          placeholder="Paste your API token here"
          onChange={handleInputChange}
        />
      </FormControl>
      <Button onClick={handleClick} disabled={inputs.trim().length === 0 || isLoading}>Continue with Your API Token</Button>
      <Block $style={{ marginTop: '20px' }}>
        <Card>
          <StyledBody>
            This is an <strong>Unofficial</strong> control panel for
            {' '}
            <StyledLink href="https://vercel.com" target="_blank" rel="external nofollow noreferrer noopenner">Vercel</StyledLink>.
            {' '}
            Your API token will only be stored in your browser locally.
          </StyledBody>
        </Card>
      </Block>
    </div>
  );
};

const Login = () => {
  const [css] = useStyletron();
  return (
    <div
      className={css({
        display: 'flex',
        justifyContent: 'center',
        height: '100vh'
      })}
    >
      <div
        className={css({
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center'
        })}
      >
        <HeadingLevel>
          <Heading styleLevel={3} $style={{ fontWeight: 700 }}>Log in to Vercel DNS</Heading>
        </HeadingLevel>
        <LoginForm />
      </div>
    </div>
  );
};

export default Login;
