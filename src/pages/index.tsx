import type { NextPageWithLayout } from '@/pages/_app';
import { Layout } from '@/components/layout';

const Home: NextPageWithLayout = () => {
  return (
    <div>
    </div>
  );
};

Home.getLayout = (children, prop) => {
  return (
    <Layout>
      {children}
    </Layout>
  );
};

export default Home;
