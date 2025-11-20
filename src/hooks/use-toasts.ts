import { useToasts as useGeistToasts } from '@geist-ui/core';
import { useStableHandler } from 'foxact/use-stable-handler-only-when-you-know-what-you-are-doing-or-you-will-be-fired';

export function useToasts() {
  const { setToast: origSetToast, removeAll: origClearToasts } = useGeistToasts();
  return {
    setToast: useStableHandler(origSetToast),
    clearToasts: useStableHandler(origClearToasts)
  };
}
