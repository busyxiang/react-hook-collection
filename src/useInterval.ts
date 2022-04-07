import { useEffect } from 'react';

export type UseIntervalProps = {
  intervalInSeconds: number | null;
  callback: () => void;
};

export const useInterval = (props: UseIntervalProps) => {
  const { intervalInSeconds, callback } = props;

  useEffect(() => {
    const intervalId = setInterval(
      callback,
      intervalInSeconds ? intervalInSeconds * 1000 : undefined,
    );

    return () => clearInterval(intervalId);
  }, [intervalInSeconds]);
};
