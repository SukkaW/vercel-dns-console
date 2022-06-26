import { Modal } from '@geist-ui/core';
import React, { useCallback, useMemo, useState } from 'react';

export const useModal = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [element, setElement] = useState<React.ReactNode | null>(null);

  const openModal = useCallback(() => setIsVisible(true), []);
  const closeModal = useCallback(() => setIsVisible(false), []);

  const modal = useMemo(() => (
    <Modal visible={isVisible} onClose={closeModal}>
      {element}
      {/* <Modal.Title>Modal</Modal.Title>
        <Modal.Subtitle>This is a modal</Modal.Subtitle>
        <Modal.Content>
          <p>Some content contained within the modal.</p>
        </Modal.Content>
        <Modal.Action passive onClick={() => setState(false)}>Cancel</Modal.Action>
        <Modal.Action>Submit</Modal.Action> */}
    </Modal>
  ), [closeModal, element, isVisible]);

  return { visible: isVisible, open: openModal, close: closeModal, setContent: setElement, modalNode: modal };
};
