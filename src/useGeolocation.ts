import { useEffect, useState } from 'react';

type LatLngLiteral = {
  lat: number;
  lng: number;
};

const useGeolocation = () => {
  const [currentPosition, setCurrentPosition] = useState<LatLngLiteral>();

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        setCurrentPosition({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      });
    }
  }, []);

  return { currentPosition };
};

export default useGeolocation;
