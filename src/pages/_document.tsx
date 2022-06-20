import Document, { Head, Html, Main, NextScript, type DocumentProps, type DocumentContext, type DocumentInitialProps } from 'next/document';
import { Server, Sheet } from 'styletron-engine-atomic';
import { styletron } from '@/lib/styletron';

const MyDocument = (props: DocumentProps & { styletronSheets: Sheet[] }) => (
  <Html>
    <Head>
      {props.styletronSheets.map((sheet, i) => (
        <style
          className="_styletron_"
          dangerouslySetInnerHTML={{ __html: sheet.css }}
          media={sheet.attrs.media}
          data-hydrate={sheet.attrs['data-hydrate']}
          key={i}
        />
      ))}
    </Head>
    <body>
      <Main />
      <NextScript />
    </body>
  </Html>
);

MyDocument.getInitialProps = async (ctx: DocumentContext): Promise<DocumentInitialProps & { styletronSheets: Sheet[] }> => {
  const initialProps = await Document.getInitialProps(ctx);
  const styletronSheets = (styletron as Server).getStylesheets() || [];
  return { ...initialProps, styletronSheets };
};

export default MyDocument;
