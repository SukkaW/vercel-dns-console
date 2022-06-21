import '@/styles/app.css';

import { GeistProvider, CssBaseline } from '@geist-ui/core';

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
    <GeistProvider>
      <CssBaseline />
      {getLayout(<Component {...pageProps} />, pageProps)}
    </GeistProvider>
  );
};

export default App;
