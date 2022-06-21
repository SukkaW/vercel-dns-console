import { Link, Note, Text } from '@geist-ui/core';
import { memo } from 'react';

export const Notice = memo(() => (
  <Note type="success">
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
      <br />
      The website is not affiliated or associated with Vercel, Inc.
      <br />
      {'\u25B2'} is the trademark of Vercel, Inc. or its affiliates in the US and other countries.
    </Text>
  </Note>
));

if (process.env.NODE_ENV !== 'production') {
  Notice.displayName = 'Notice';
}
