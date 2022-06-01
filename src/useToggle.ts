import { useState, useCallback } from 'react';

const useToggle = (initialValue?: boolean) => {
  const [on, setOn] = useState<boolean>(!!initialValue);

  const toggle = useCallback(() => {
    setOn((prev) => !prev);
  }, []);

  const reset = useCallback(() => {
    if (initialValue !== undefined) {
      setOn(initialValue);
    }
  }, [initialValue]);

  return [on, toggle, reset] as const;
};

export default useToggle;
