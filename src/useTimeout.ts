import { useEffect } from 'react';

export type UseTimeoutProps = {
  callback: () => void;
  delayInSeconds: number;
};

export const useTimeout = (props: UseTimeoutProps) => {
  const { callback, delayInSeconds } = props;

  useEffect(() => {
    const timeoutId = setTimeout(callback, delayInSeconds * 1000);

    return () => clearTimeout(timeoutId);
  }, [delayInSeconds]);
};
