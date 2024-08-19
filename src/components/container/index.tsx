import { useTheme } from '@geist-ui/core';

export const Container = (props: { children: React.ReactNode } & React.JSX.IntrinsicElements['section']) => {
  const theme = useTheme();
  const { children, ...rest } = props;

  return (
    <section {...rest}>
      {children}
      <style jsx>{`
      section {
        padding-top: ${theme.layout.pageMargin};
        padding-bottom: ${theme.layout.pageMargin};
        padding-left: ${theme.layout.gap};
        padding-right: ${theme.layout.gap};
        margin-left: auto;
        margin-right: auto;
        max-width: ${theme.layout.pageWidthWithMargin};
      }
      `}</style>
    </section>
  );
};
