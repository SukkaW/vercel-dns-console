import type React from 'react';
import { useCallback, useMemo } from 'react';

import { Link, Popover, Spacer, Text, useTheme } from '@geist-ui/core';
import NextLink from 'next/link';
import Image, { type ImageLoader } from 'next/image';

import { Skeleton } from '../skeleton';
import { VercelLogo } from '../vercel-brand/logo';

import { useRouter } from 'next/router';
import { useVercelUser } from '@/hooks/use-vercel-user';
import { useVercelApiToken } from '@/hooks/use-vercel-api-token';
import { useToasts } from '@/hooks/use-toasts';

import { Container } from '../container';
import { Menu, MenuItem } from '../menu';

import GitHub from '@geist-ui/icons/github';

const vercelAvatarLoader: ImageLoader = ({ src, width }) => {
  return `${src}?s=${width}`;
};

const AvatarMenu = (props: { avatar?: string, name?: string }) => {
  const [, setToken] = useVercelApiToken();
  const { setToast } = useToasts();
  const router = useRouter();

  const logout = useCallback(() => {
    setToken(null);
    setToast({
      text: 'You have been logged out',
      type: 'success',
      delay: 3000
    });
    router.push('/login');
  }, [setToken, setToast, router]);

  const handleLogoutClick = useCallback(() => {
    logout();
  }, [logout]);

  return (
    <>
      <Menu
        itemMinWidth={150}
        content={(
          <>
            <MenuItem>
              <NextLink href="/">
                <Link>
                  Dashboard
                </Link>
              </NextLink>
            </MenuItem>
            <MenuItem>
              <GitHub size={16} />
              <Spacer inline w={1 / 3} />
              <Link href="https://github.com/sukkaw/vercel-dns-console">
                Source Code
              </Link>
            </MenuItem>
            <Popover.Item line />
            <MenuItem onClick={handleLogoutClick}>
              <Text span type="error">Log Out</Text>
            </MenuItem>
          </>
        )}
      >
        {
          props?.avatar
            ? (
              <Image
                alt={`${props?.name}'s Avatar`}
                style={{
                  borderRadius: '50%',
                  userSelect: 'none',
                  cursor: 'pointer'
                }}
                loader={vercelAvatarLoader}
                src={`https://api.vercel.com/www/avatar/${props.avatar}`}
                height={36}
                width={36}
              />
            )
            : (
              <Skeleton.Avatar />
            )
        }
      </Menu>
    </>
  );
};

export const Layout = (props: {
  children: React.ReactNode
}) => {
  const { data } = useVercelUser();
  const theme = useTheme();

  return (
    <>
      {
        useMemo(() => (
          <div className="navbar-wrapper">
            <nav className="navbar">
              <div className="content">
                <div className="logo">
                  <NextLink href="/">
                    <a aria-label="Go Home">
                      <VercelLogo />
                    </a>
                  </NextLink>
                </div>
                <AvatarMenu name={data?.name} avatar={data?.avatar} />
              </div>
            </nav>
          </div>
        ), [data?.avatar, data?.name])
      }
      <Container className="page">
        {props.children}
      </Container>
      <style jsx>{`
    :global(section.page.page) {
      margin-top: 64px;
      min-height: calc(100vh - 64px);
    }

    .navbar-wrapper {
      height: 64px;
      background-color: ${theme.palette.background};
      box-shadow: 0 0 15px 0 rgba(0, 0, 0, 0.1);
      z-index: 999;
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
    }
    .navbar {
      height: 64px;
    }
    nav .content {
      display: flex;
      align-items: center;
      justify-content: space-between;
      max-width: ${theme.layout.pageWidthWithMargin};
      height: 100%;
      margin: 0 auto;
      user-select: none;
      padding: 0 ${theme.layout.gap};
    }
    .logo {
      flex: 1 1;
      display: flex;
      align-items: center;
      justify-content: flex-start;
    }
    .logo a {
      display: inline-flex;
      flex-direction: row;
      align-items: center;
      font-size: 1.125rem;
      font-weight: 500;
      color: inherit;
      height: 28px;
    }
    .controls {
      flex: 1 1;
      display: flex;
      align-items: center;
      justify-content: flex-end;
    }
    .avatar :global(.menu-toggle) {
      display: flex;
      align-items: center;
      min-width: 40px;
      height: 40px;
      padding: 0;
    }

    .avatar {
      display: flex;
      align-items: center;
    }
  `}</style>
    </>
  );
};
