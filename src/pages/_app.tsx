import '@/styles/app.css';

import { Provider as StyletronProvider } from 'styletron-react';
import { LightTheme, BaseProvider } from 'baseui';
import { styletron } from '@/lib/styletron';

import { ToasterContainer, PLACEMENT } from 'baseui/toast';

import type { AppProps } from 'next/app';
import type { NextPage } from 'next/types';

export type NextPageWithLayout<P = Record<string, unknown>> = NextPage<P> & {
  getLayout?: (page: React.ReactElement, props: P) => React.ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

const App = ({ pageProps, Component }: AppPropsWithLayout) => {
  const getLayout = Component.getLayout || ((page) => page);

  return (
    <StyletronProvider value={styletron}>
      <BaseProvider theme={LightTheme}>
        <ToasterContainer
          placement={PLACEMENT.topRight}
          autoHideDuration={3000}
          overrides={{
            ToastBody: {
              style: {
                width: 'auto'
              }
            },
            ToastInnerContainer: {
              style: {
                marginRight: '4px'
              }
            }
          }}
        />
        {getLayout(<Component {...pageProps} />, pageProps)}
      </BaseProvider>
    </StyletronProvider>
  );
};

export default App;
