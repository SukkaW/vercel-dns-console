import { useStyletron } from 'baseui';
import type React from 'react';

import { VercelLogo } from '../vercel-brand/logo';
import Image, { type ImageLoader } from 'next/image';

import { Button, KIND, SHAPE, SIZE } from 'baseui/button';
import { Skeleton } from 'baseui/skeleton';
import { StyledList, StyledListItem } from 'baseui/menu';
import { StatefulPopover, PLACEMENT, TRIGGER_TYPE } from 'baseui/popover';

import { useVercelUser } from '@/hooks/use-vercel-user';

const vercelAvatarLoader: ImageLoader = ({ src, width }) => {
  return `${src}?s=${width}`;
};

const AvatarMenu = (props: { avatar?: string, name?: string }) => {
  const [css] = useStyletron();

  return (
    <StatefulPopover
      placement={PLACEMENT.bottomRight}
      accessibilityType="menu"
      triggerType={TRIGGER_TYPE.click}
      content={() => (
        <StyledList>
          <StyledListItem>Log out</StyledListItem>
        </StyledList>
      )}
      returnFocus
      autoFocus
    >
      <Button kind={KIND.tertiary} shape={SHAPE.circle} size={SIZE.compact}>
        {
          props?.avatar
            ? (
              <Image
                alt={`${props?.name}'s Avatar`}
                className={css({
                  borderRadius: '50%',
                  userSelect: 'none'
                })}
                loader={vercelAvatarLoader}
                src={`https://api.vercel.com/www/avatar/${props.avatar}`}
                height={30}
                width={30}
              />
            )
            : (
              <Skeleton
                overrides={{
                  Root: {
                    style: {
                      borderRadius: '50%'
                    }
                  }
                }}
                height="30px"
                width="30px"
                animation
              />
            )
        }
      </Button>
    </StatefulPopover>
  );
};

export const Layout = (props: {
  children: React.ReactNode
}) => {
  const [css, theme] = useStyletron();

  const { data } = useVercelUser();

  return (
    <>
      <header
        className={css({
          ...theme.typography.ParagraphMedium,
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          paddingTop: theme.sizing.scale500,
          paddingBottom: theme.sizing.scale500,
          paddingLeft: theme.sizing.scale800,
          paddingRight: theme.sizing.scale800,
          borderBottomStyle: 'solid',
          borderBottomWidth: '1px',
          borderBottomColor: theme.colors.borderOpaque
        })}
      >
        <div
          className={css({
            marginLeft: 'none',
            marginRight: 'auto',
            display: 'flex',
            alignItems: 'center'
          })}
        >
          <VercelLogo />
        </div>
        <div
          className={css({
            marginLeft: 'auto',
            marginRight: 'none',
            display: 'flex',
            alignItems: 'center'
          })}
        >
          <AvatarMenu name={data?.name} avatar={data?.avatar} />
        </div>
      </header>
      {props.children}
    </>
  );
};
