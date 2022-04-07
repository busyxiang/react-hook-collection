import { useState, useCallback } from 'react';

type ReturnType = [boolean, () => void, () => void];

const useToggle = (initialValue?: boolean): ReturnType => {
  const [on, setOn] = useState<boolean>(!!initialValue);

  const toggle = useCallback(() => {
    setOn((prev) => !prev);
  }, []);

  const reset = useCallback(() => {
    if (initialValue !== undefined) {
      setOn(initialValue);
    }
  }, [initialValue]);

  return [on, toggle, reset];
};

export default useToggle;
