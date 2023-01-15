import NextHead from 'next/head';

interface NotFoundErrorProps {
  title: string,
  body?: React.ReactNode
}

export const NotFoundError = ({
  title,
  body
}: NotFoundErrorProps) => {
  const titleText = `404 | ${title}`;
  return (
    <div className="error-container">
      <NextHead>
        <title>
          {titleText}
        </title>
      </NextHead>
      <div>
        <h1>
          404
        </h1>
        <span className="dividing-line" />
        <div className="error-desc">
          <h2>
            {body ?? title}
          </h2>
        </div>
      </div>
      <style jsx>{`
        .error-container {
          height: calc(100vh - 64pt - 48px);
          display: flex;
          text-align: center;
          align-items: center;
          justify-content: center;
          flex-direction: column;
        }

        .error-desc {
          display: inline-block;
          text-align: left;
          line-height: 56px;
          height: 56px;
          vertical-align: middle;
        }

        .dividing-line {
          margin-right: 20px;
          border-right: 1px solid;
          opacity: 0.3;
          padding: 10px 0 15px 0;
        }

        h1 {
          display: inline-block;
          margin-bottom: 0;
          font-size: 24px;
          font-weight: 500;
          vertical-align: top;
          padding: 10px 23px 10px 0;
        }

        h2 {
          margin: 0;
          padding: 0;
          font-size: 18px;
          line-height: inherit;
        }
      `}</style>
    </div>
  );
};
