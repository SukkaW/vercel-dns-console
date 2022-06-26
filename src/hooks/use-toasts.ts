import { useToasts as useGeistToasts } from '@geist-ui/core';
import { useConstHandler } from './use-const-handler';

export const useToasts = () => {
  const { setToast: origSetToast, removeAll: origClearToasts } = useGeistToasts();
  return {
    setToast: useConstHandler(origSetToast),
    clearToasts: useConstHandler(origClearToasts)
  };
};
