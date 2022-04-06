import { useState, useEffect, useCallback } from 'react';

export type FetchConfig = {
  url: string;
  requestConfig?: RequestInit;
};

export const useFetch = <T>(config: FetchConfig) => {
  const { url, requestConfig } = config;

  const [data, setData] = useState<T>();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);

  useEffect(() => {
    handleLoadData();
  }, []);

  const handleLoadData = useCallback(async () => {
    setLoading(true);

    try {
      const res = await fetch(url, requestConfig);
      const parsedData = await res.json();

      setData(parsedData);
    } catch (error) {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [url]);

  return { data, loading, error };
};
