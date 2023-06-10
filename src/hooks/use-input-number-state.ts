import { useCallback, useState } from 'react';

type UseNumberState = (initialValue: number | null) => Readonly<[
  number | null,
  (value: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | string | number) => void
]>;
export const useInputNumberState: UseNumberState = (initialValue) => {
  const [value, setValue] = useState<number | null>(() => (Number.isNaN(initialValue) ? null : initialValue));

  const setNumber = useCallback((input: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | string | number) => {
    let v;
    if (typeof input === 'string') {
      if (input === '') {
        setValue(null);
        return;
      }

      v = Number.parseInt(input, 10);
    } else if (typeof input === 'number') {
      v = input;
    } else if (input.target) {
      if (input.target.value === '') {
        setValue(null);
        return;
      }
      v = Number.parseInt(input.target.value, 10);
    }

    if (v && !Number.isNaN(v)) {
      setValue(v);
    }
  }, []);

  return [value, setNumber] as const;
};
