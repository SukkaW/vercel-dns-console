import { useCallback, useState } from 'react';

export type BindingsChangeTarget =
  | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  | string;

export const useInput = (
  initialValue: string
) => {
  const [state, setState] = useState(initialValue);

  return {
    state,
    setState,
    reset: useCallback(() => setState(initialValue), [initialValue]),
    bindings: {
      value: state,
      onChange: (event: BindingsChangeTarget) => {
        if (typeof event === 'string') {
          setState(event);
        } else {
          setState(event.target.value);
        }
      }
    }
  };
};
