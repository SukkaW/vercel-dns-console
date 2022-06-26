import { useClipboard } from '@/hooks/use-clipboard';
import { Button, type ScaleProps, type ButtonProps } from '@geist-ui/core';
import { useCallback, useEffect } from 'react';
import Copy from '@geist-ui/icons/copy';
import Check from '@geist-ui/icons/check';
import { useToasts } from '@/hooks/use-toasts';

export const CopyButton = (props: ButtonProps & ScaleProps & { copyValue?: string }) => {
  const { copyValue, ...rest } = props;

  const { copy, copied, error } = useClipboard();
  const { setToast, clearToasts } = useToasts();

  const handleClick = useCallback(() => copy(copyValue ?? ''), [copy, copyValue]);
  const icon = copied ? <Check /> : <Copy />;

  const hasError = !!error;
  useEffect(() => {
    if (hasError) {
      setToast({
        text: 'Fail to copy to clipboard!',
        type: 'error',
        delay: 3000
      });
    }
  }, [hasError, setToast]);

  return (
    <Button {...rest} onClick={handleClick} icon={icon} type={copied ? 'success' : 'default'} />
  );
};
