import { Popover, useTheme } from '@geist-ui/core';

export const Menu = (props: {
  children?: React.ReactNode;
  content?: React.ReactNode;
  itemMinWidth?: number;
  style?: React.CSSProperties;
}) => {
  const theme = useTheme();

  return (
    <Popover
      style={{ display: 'flex', ...props.style }}
      placement="bottomEnd"
      content={(
        <div className="menu-content">
          {props.content}
        </div>
      )}
    >
      <span>
        {props.children}
      </span>
      <style jsx>{`
          span {
            cursor: pointer;
            display: inline-flex;
          }

          :global(.tooltip-content.popover > .inner.inner) {
            padding: 8px 0;
          }

          .menu-content {
            min-width: ${props.itemMinWidth || 120}px;
          }

          .menu-content :global(.item) {
            cursor: pointer;
          }

          .menu-content :global(.item:hover) {
            cursor: pointer;
            background: ${theme.palette.accents_1};
          }
      `}</style>
    </Popover>
  );
};

export const MenuItem = Popover.Item;
