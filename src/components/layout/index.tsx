import type React from 'react';
import { useCallback } from 'react';

import { Popover, useTheme, useToasts } from '@geist-ui/core';
import NextLink from 'next/link';
import Image, { type ImageLoader } from 'next/image';

import { Skeleton } from '../skeleton';
import { VercelLogo } from '../vercel-brand/logo';

import { useRouter } from 'next/router';
import { useVercelUser } from '@/hooks/use-vercel-user';
import { useVercelApiToken } from '@/hooks/use-vercel-api-token';
import { useConstHandler } from '@/hooks/use-const-handler';
import { Container } from '../container';

const vercelAvatarLoader: ImageLoader = ({ src, width }) => {
  return `${src}?s=${width}`;
};

const AvatarMenu = (props: { avatar?: string, name?: string }) => {
  const theme = useTheme();

  const [, setToken] = useVercelApiToken();
  const { setToast: origSetToast } = useToasts();
  const setToast = useConstHandler(origSetToast);
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
      <Popover
        style={{ display: 'flex' }}
        placement="bottomEnd"
        content={(
          <div className="menu-content">
            <Popover.Item onClick={handleLogoutClick}>
              <span>Log Out</span>
            </Popover.Item>
          </div>
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
      </Popover>
      <style jsx>{`
          .menu-content {
            min-width: 100px
          }

          .menu-content :global(.item) {
            cursor: pointer;
          }

          .menu-content :global(.item:hover) {
            cursor: pointer;
            background: ${theme.palette.accents_1};
          }
      `}</style>
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
      <div className="menu-wrapper">
        <nav className="menu">
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
      <Container className="page">
        {props.children}
      </Container>
      <style jsx>{`
    :global(section.page.page) {
      margin-top: 64px;
      min-height: calc(100vh - 64px);
    }

    .menu-wrapper {
      height: 64px;
      background-color: ${theme.palette.background};
      box-shadow: 0 0 15px 0 rgba(0, 0, 0, 0.1);
      z-index: 999;
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
    }
    .menu {
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
