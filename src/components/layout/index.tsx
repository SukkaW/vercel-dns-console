import type React from 'react';

import { VercelLogo } from '../vercel-brand/logo';
import Image, { type ImageLoader } from 'next/image';

import { useVercelUser } from '@/hooks/use-vercel-user';
import { Page } from '@geist-ui/core';

const vercelAvatarLoader: ImageLoader = ({ src, width }) => {
  return `${src}?s=${width}`;
};

const AvatarMenu = (props: { avatar?: string, name?: string }) => {
  return (
    props?.avatar
      ? (
        <Image
          alt={`${props?.name}'s Avatar`}
          style={{
            borderRadius: '50%',
            userSelect: 'none'
          }}
          loader={vercelAvatarLoader}
          src={`https://api.vercel.com/www/avatar/${props.avatar}`}
          height={30}
          width={30}
        />
      )
      : (
        <div />
      )
  );
};

export const Layout = (props: {
  children: React.ReactNode
}) => {
  const { data } = useVercelUser();

  return (
    <Page>
      {
        // display: 'flex',
        // flexWrap: 'wrap',
        // alignItems: 'center',
        // paddingTop: theme.sizing.scale500,
        // paddingBottom: theme.sizing.scale500,
        // paddingLeft: theme.sizing.scale800,
        // paddingRight: theme.sizing.scale800,
        // borderBottomStyle: 'solid',
        // borderBottomWidth: '1px',
        // borderBottomColor: theme.colors.borderOpaque
      }
      <header>
        <div style={{
          marginLeft: 'none',
          marginRight: 'auto',
          display: 'flex',
          alignItems: 'center'
        }}>
          <VercelLogo />
        </div>
        <div
          style={{
            marginLeft: 'auto',
            marginRight: 'none',
            display: 'flex',
            alignItems: 'center'
          }}
        >
          <AvatarMenu name={data?.name} avatar={data?.avatar} />
        </div>
      </header>
      <Page.Content>
        {props.children}
      </Page.Content>
    </Page>
  );
};
