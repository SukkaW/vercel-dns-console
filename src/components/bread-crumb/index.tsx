import { Breadcrumbs } from '@geist-ui/core';
import NextLink from 'next/link';

export const BreadCrumb = (props: {
  items: Array<{
    label: React.ReactNode,
    id?: string,
    href?: string
  }>
}) => (
  <Breadcrumbs>
    {
      props.items.map((item) => {
        if (item.href) {
          return (
            <NextLink key={item.href} href={item.href} prefetch={false} passHref legacyBehavior>
              <Breadcrumbs.Item nextLink>{item.label}</Breadcrumbs.Item>
            </NextLink>
          );
        }
        return (
          <Breadcrumbs.Item key={item.id}>{item.label}</Breadcrumbs.Item>
        );
      })
    }
  </Breadcrumbs>
);
