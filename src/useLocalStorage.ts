import { useState } from 'react';

type Props<T> = {
  key: string;
  defaultValue: T;
};

const useLocalStorage = <T extends string>({
  key,
  defaultValue,
}: Props<T>): [T, (value: T) => void, () => void] => {
  const [storedValue, setStoredValue] = useState<T>(
    (localStorage.getItem(key) as T) || defaultValue,
  );

  const setStorageValue = (value: T) => {
    localStorage.setItem(key, value);

    if (value !== storedValue) {
      setStoredValue(value);
    }
  };

  const removeStorage = () => {
    localStorage.removeItem(key);
  };

  return [storedValue, setStorageValue, removeStorage];
};

export default useLocalStorage;