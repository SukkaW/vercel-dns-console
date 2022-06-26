import { useState, useCallback } from 'react';

export const useModal = () => {
  const [visible, setVisible] = useState(false);
  const open = useCallback(() => setVisible(true), []);
  const close = useCallback(() => setVisible(false), []);

  return {
    visible,
    open,
    close
  };
};
