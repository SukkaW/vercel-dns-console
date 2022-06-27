import { useCallback, useState } from 'react';

export type BindingsChangeTarget<T extends string | number> =
  | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  | T;

export const useInput = <T extends string | number>(
  initialValue: T
) => {
  const [state, setState] = useState<T>(initialValue);

  return {
    state,
    setState,
    reset: useCallback(() => setState(initialValue), [initialValue]),
    bindings: {
      value: state,
      onChange: (event: BindingsChangeTarget<T>) => {
        if (typeof event === 'object' && event.target) {
          setState(event.target.value);
        } else {
          setState(event as T);
        }
      }
    }
  };
};
