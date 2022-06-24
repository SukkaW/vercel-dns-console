import { useTheme } from '@geist-ui/core';
import { forwardRef } from 'react';
import { type HeaderGroup } from 'react-table';
import { TableDataItemBase } from './types';

import ArrowUp from '@geist-ui/icons/arrowUp';
import ArrowDown from '@geist-ui/icons/arrowDown';

declare module 'react' {
  function forwardRef<T, P = object>(
    render: (props: P, ref: React.Ref<T>) => React.ReactElement | null
  ): (props: P & React.RefAttributes<T>) => React.ReactElement | null;
}

const OrigTHead = <T extends TableDataItemBase>(
  props: {
    headerGroup: HeaderGroup<T>,
  } & JSX.IntrinsicElements['thead'],
  ref: React.ForwardedRef<HTMLTableSectionElement>
) => {
  const theme = useTheme();
  const { headerGroup, ...rest } = props;
  const { headers } = headerGroup;
  const thElements = (
    <>
      {headers.map((header, index) => {
        const { key, style, ...rest } = header.getHeaderProps(header.getSortByToggleProps());
        return (
          <th
            key={key}
            style={{
              ...style,
              width: header.width,
              minWidth: header.minWidth,
              maxWidth: header.maxWidth
            }}
            {...rest}
          >
            <div className="thead-box">
              {header.render('Header')}
              <span>
                {/* Add a sort direction indicator */}
                {/* eslint-disable-next-line no-nested-ternary */}
                {header.isSorted
                  ? header.isSortedDesc
                    ? <ArrowDown size={12} />
                    : <ArrowUp size={12} />
                  : ''}
              </span>
            </div>
          </th>
        );
      })}
      <style jsx>{`
          th {
            position: relative;
            padding: 0 0.5em;
            font-size: calc(0.75 * var(--table-font-size));
            font-weight: normal;
            text-align: left;
            letter-spacing: 0;
            vertical-align: middle;
            line-height: 24px;
            min-height: calc(1.25 * var(--table-font-size));
            color: ${theme.palette.accents_5};
            background: ${theme.palette.accents_1};
            border-bottom: 1px solid ${theme.palette.border};
            border-top: 1px solid ${theme.palette.border};
            border-radius: 0;
          }

          th:nth-child(1) {
            border-bottom: 1px solid ${theme.palette.border};
            border-left: 1px solid ${theme.palette.border};
            border-top: 1px solid ${theme.palette.border};
            border-top-left-radius: ${theme.layout.radius};
            border-bottom-left-radius: ${theme.layout.radius};
          }

          th:last-child {
            border-bottom: 1px solid ${theme.palette.border};
            border-right: 1px solid ${theme.palette.border};
            border-top: 1px solid ${theme.palette.border};
            border-top-right-radius: ${theme.layout.radius};
            border-bottom-right-radius: ${theme.layout.radius};
          }

          .thead-box {
            display: flex;
            padding: 8px 2px;
            align-items: center;
            min-height: calc(2 * var(--table-font-size));
            text-transform: uppercase;
          }

          span {
            display: inline-flex;
            margin-left: 0.1em;
          }
      `}</style>
    </>
  );

  return (
    <thead
      style={{
        // position: isSticky ? 'fixed' : 'static',
        // clipPath: isSticky ? 'inset(0px 0px -100px)' : undefined
      }}
      ref={ref}
      {...rest}
    >
      <tr
        {...headerGroup.getHeaderGroupProps()}
      >
        {thElements}
      </tr>
      <style jsx>{`
          thead {
            border-collapse: separate;
            border-spacing: 0;
            font-size: inherit;
            margin-top: 0;
            z-index: 2;
            top: 64px;
          }

          tr :global(th) {
            position: sticky;
            top: 0;
          }

          tr {
            transition: box-shadow 0.15s ease 0s
          }
        `}</style>
    </thead>
  );
};

export const THead = forwardRef(OrigTHead);

export type TableHeadProps<T extends TableDataItemBase> = {
  headerGroup: HeaderGroup<T>
  isSticky?: boolean
  theadRef?: React.RefObject<HTMLTableSectionElement>
  clonedTheadRef?: React.RefObject<HTMLTableSectionElement>
};

export const TableHead = <T extends TableDataItemBase>(
  {
    headerGroup
  }: TableHeadProps<T>
) => {
  return (
    <THead
      headerGroup={headerGroup}
    />
  );
};
