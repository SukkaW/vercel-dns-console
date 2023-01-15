import { useTheme } from '@geist-ui/core';
import { type HeaderGroup } from 'react-table';
import type { TableDataItemBase } from './types';

import ArrowUp from '@geist-ui/icons/arrowUp';
import ArrowDown from '@geist-ui/icons/arrowDown';
import clsx from 'clsx';

export interface TableHeadProps<T extends TableDataItemBase> {
  headerGroup: HeaderGroup<T>
  isSticky?: boolean
  theadRef?: React.RefObject<HTMLTableSectionElement>
  clonedTheadRef?: React.RefObject<HTMLTableSectionElement>
}

export const TableHead = <T extends TableDataItemBase>(
  props: {
    headerGroup: HeaderGroup<T>,
  } & JSX.IntrinsicElements['thead']
) => {
  const theme = useTheme();
  const { headerGroup, ...rest } = props;
  const { headers } = headerGroup;
  const thElements = (
    <>
      {headers.map((header) => {
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
            <div className={clsx('thead-box', header.headerClassName)}>
              {header.render('Header')}
              <span>
                {/* Add a sort direction indicator */}
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
