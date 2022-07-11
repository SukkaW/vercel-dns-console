import { useCallback, useRef, useState } from 'react';
import { useToasts } from '@/hooks/use-toasts';

export function useClipboard({ timeout = 1000, showToastWhenError = false } = {}) {
  const [error, setError] = useState<Error | null>(null);
  const [copied, setCopied] = useState(false);
  const copyTimeoutRef = useRef<number | null>(null);

  const { setToast } = useToasts();

  const handleCopyResult = useCallback((value: boolean) => {
    if (copyTimeoutRef.current) {
      clearTimeout(copyTimeoutRef.current);
    }
    copyTimeoutRef.current = setTimeout(() => setCopied(false), timeout) as unknown as number;
    setCopied(value);
  }, [timeout]);

  const copy = useCallback((valueToCopy: any) => {
    if ('clipboard' in navigator) {
      navigator.clipboard
        .writeText(valueToCopy)
        .then(() => handleCopyResult(true))
        .catch((err) => {
          setError(err);
          if (showToastWhenError) {
            setToast({
              text: 'Fail to copy to clipboard!',
              type: 'error',
              delay: 3000
            });
          }
        });
    } else {
      setError(new Error('useClipboard: navigator.clipboard is not supported'));
      if (showToastWhenError) {
        setToast({
          text: 'Fail to copy to clipboard!',
          type: 'error',
          delay: 3000
        });
      }
    }
  }, [handleCopyResult]);

  const reset = () => {
    setCopied(false);
    setError(null);
    if (copyTimeoutRef.current) {
      clearTimeout(copyTimeoutRef.current);
    }
  };

  return { copy, reset, error, copied };
}
