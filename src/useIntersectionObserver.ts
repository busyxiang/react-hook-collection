import { useState, RefObject, useEffect } from 'react';

type UseIntersectionObserverProps = {
  elementRef: RefObject<Element>;
  observerConfig?: IntersectionObserverInit;
};

const useIntersectionObserver = (props: UseIntersectionObserverProps) => {
  const { elementRef, observerConfig } = props;

  const [isIntersecting, setIsIntersecting] = useState<boolean>(false);

  useEffect(() => {
    const node = elementRef.current;

    if (!node) {
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setIsIntersecting(true);
      }
    }, observerConfig);

    observer.observe(node);

    return () => observer.disconnect();
  }, [elementRef, observerConfig]);

  return isIntersecting;
};

export default useIntersectionObserver;
