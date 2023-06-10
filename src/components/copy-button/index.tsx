import { useClipboard } from 'foxact/use-clipboard';
import { Button } from '@geist-ui/core';
import { useToasts } from '@/hooks/use-toasts';
import type { ScaleProps, ButtonProps } from '@geist-ui/core';
import { useCallback } from 'react';
import Copy from '@geist-ui/icons/copy';
import Check from '@geist-ui/icons/check';

export const CopyButton = ({ copyValue, ...rest }: ButtonProps & ScaleProps & { copyValue?: string }) => {
  const { setToast } = useToasts();
  const handleCopyError = useCallback(() => {
    setToast({
      text: 'Fail to copy to clipboard!',
      type: 'error',
      delay: 3000
    });
  }, [setToast]);

  const { copy, copied } = useClipboard({ onCopyError: handleCopyError });
  const handleClick = useCallback(() => copy(copyValue ?? ''), [copy, copyValue]);

  return (
    <Button {...rest} onClick={handleClick} icon={copied ? <Check /> : <Copy />} type={copied ? 'success' : 'default'} />
  );
};
