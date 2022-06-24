import { Breadcrumbs } from '@geist-ui/core';
import NextLink from 'next/link';

export const BreadCrumb = (props: {
  items: {
    label: React.ReactNode;
    id?: string;
    href?: string;
  }[]
}) => {
  return (
    <Breadcrumbs>
      {
        props.items.map((item) => {
          if (item.href) {
            return (
              <NextLink key={item.href} href={item.href} passHref>
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
};
