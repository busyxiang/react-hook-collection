import { useRef, useEffect } from 'react';

export type useValueProps<T> = {
  value: T;
  onChange: (newValue: T) => void;
};

export const useValue = <T>(props: useValueProps<T>) => {
  const { value, onChange } = props;

  const valueRef = useRef<T>(value);

  useEffect(() => {
    if (valueRef.current !== value) {
      valueRef.current = value;

      onChange(value);
    }
  }, [value]);

  return valueRef.current;
};
