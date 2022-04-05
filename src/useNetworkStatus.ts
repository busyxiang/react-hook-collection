import { useEffect, useState } from 'react';

const useNetworkStatus = () => {
  const [online, setOnline] = useState<boolean>(false);

  useEffect(() => {
    const handleUpdateToOnline = () => setOnline(true);
    const handleUpdateToOffline = () => setOnline(true);

    window.addEventListener('online', handleUpdateToOnline);
    window.addEventListener('offline', handleUpdateToOffline);

    return () => {
      window.removeEventListener('online', handleUpdateToOnline);
      window.removeEventListener('offline', handleUpdateToOffline);
    };
  }, []);

  return online;
};

export default useNetworkStatus;
