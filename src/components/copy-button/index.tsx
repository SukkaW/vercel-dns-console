import { useClipboard } from '@/hooks/use-clipboard';
import { Button, type ScaleProps, type ButtonProps } from '@geist-ui/core';
import { useCallback } from 'react';
import Copy from '@geist-ui/icons/copy';
import Check from '@geist-ui/icons/check';

export const CopyButton = (props: ButtonProps & ScaleProps & { copyValue?: string }) => {
  const { copyValue, ...rest } = props;

  const { copy, copied } = useClipboard({ showToastWhenError: true });

  const handleClick = useCallback(() => copy(copyValue ?? ''), [copy, copyValue]);
  const icon = copied ? <Check /> : <Copy />;

  return (
    <Button {...rest} onClick={handleClick} icon={icon} type={copied ? 'success' : 'default'} />
  );
};
