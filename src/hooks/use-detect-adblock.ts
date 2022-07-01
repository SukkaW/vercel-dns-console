import { useEffect, useRef, useState } from 'react';

export const useDetectAdBlock = () => {
  const [isAdBlockEnabled, setIsAdBlockEnabled] = useState(false);
  const isCheckedRef = useRef(false);

  useEffect(() => {
    if (!isCheckedRef.current) {
      let isCancelled = false;

      (async () => {
        const res = await fetch('/api/post', { method: 'POST', headers: { 'Content-Type': 'application/json' } });
        const data = await res.text();

        if (!isCancelled) {
          if (data.length === 0) {
            isCheckedRef.current = true;
            setIsAdBlockEnabled(true);
          }
        }
      })();

      return () => {
        isCancelled = true;
      };
    }
  }, []);

  return isAdBlockEnabled;
};
