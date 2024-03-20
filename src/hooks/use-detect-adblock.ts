import { useRef, useState } from 'react';
import { useEffect } from 'foxact/use-abortable-effect';

export const useDetectAdBlock = () => {
  const [isAdBlockEnabled, setIsAdBlockEnabled] = useState(false);
  const isCheckedRef = useRef(false);

  useEffect((signal) => {
    if (!isCheckedRef.current) {
      (async () => {
        const res = await fetch('/api/post', { method: 'POST', headers: { 'Content-Type': 'application/json' } });
        const data = await res.text();

        if (!signal.aborted) {
          if (data.length === 0) {
            isCheckedRef.current = true;
            setIsAdBlockEnabled(true);
          }
        }
      })();
    }
  }, []);

  return isAdBlockEnabled;
};
