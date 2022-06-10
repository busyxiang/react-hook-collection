import { useState, useRef, useCallback } from 'react';

const useStateHistory = <T>({ initialValue }: { initialValue?: T }) => {
  const [state, setInnerState] = useState<T>(initialValue as T);
  const stateHistory = useRef<T[]>(initialValue ? [initialValue] : []);

  const setState = useCallback((value: T) => {
    setInnerState(value);
    stateHistory.current.push(value);
  }, []);

  return [state, setState, stateHistory.current] as const;
};

export default useStateHistory;
