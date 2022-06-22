import { Link, Note, Spacer, Text } from '@geist-ui/core';
import { memo } from 'react';

export const Notice = memo(() => (
  <Note>
    <Text p>
      This is an <Text b>Unofficial</Text> DNS control panel for
      {' '}
      <Link
        href="https://vercel.com"
        target="_blank"
        rel="external nofollow noreferrer noopenner"
        icon
        color
        underline
      >
        Vercel
      </Link>.
      {' '}
      The website is not affiliated or associated with Vercel, Inc.
    </Text>
    <Spacer h={0.5} />
    <Text p>
      {'\u25B2'} is the trademark of Vercel, Inc. or its affiliates in the US and other countries.
    </Text>
    <Spacer h={0.5} />
    <Text p>
      The website is built with
      {' '}
      <Link
        href="https://geist-ui.dev/"
        target="_blank"
        rel="external nofollow noreferrer noopenner"
        icon
        color
        underline
      >
        Geist UI
      </Link>
      ,{' '}
      an open source design system for building modern websites and applications, originating from Vercel design system, maintained by the community, and not associated with Vercel, Inc.
    </Text>
  </Note>
));

if (process.env.NODE_ENV !== 'production') {
  Notice.displayName = 'Notice';
}
