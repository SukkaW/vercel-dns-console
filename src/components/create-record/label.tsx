import { useScale, withScale } from '@geist-ui/core';
import type React from 'react';

function Label(props: React.PropsWithChildren<{ label: React.ReactNode }>) {
  const { SCALES } = useScale();

  return (
    <div className="with-label">
      <label>
        {props.label}
      </label>
      {props.children}
      <style jsx>{`
        .with-label {
            display: inline-block;
            box-sizing: border-box;
            -webkit-box-align: center;
            --input-height: ${SCALES.height(2.25)};
            font-size: ${SCALES.font(0.875)};
            width: 100%;
            padding: ${SCALES.pt(0)} ${SCALES.pr(0)} ${SCALES.pb(0)} ${SCALES.pl(0)};
            margin: ${SCALES.mt(0)} ${SCALES.mr(0)} ${SCALES.mb(0)} ${SCALES.ml(0)};
        }
        label {
          display: block;
          font-weight: normal;
          color: #444;
          padding: 0 0 0 1px;
          margin-bottom: 0.5em;
          font-size: 14px;
          line-height: 1.5;
        }
        label > :global(*:first-child) {
          margin-top: 0;
        }
        label > :global(*:last-child) {
          margin-bottom: 0;
        }
      `}</style>
    </div>
  );
}

const withScaleLabel = withScale(Label);
export { withScaleLabel as Label };
