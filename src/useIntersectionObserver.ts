import { useState, useEffect } from 'react';

type UseIntersectionObserverProps = {
  element: Element;
  observerConfig?: IntersectionObserverInit;
};

const useIntersectionObserver = (props: UseIntersectionObserverProps) => {
  const { element, observerConfig } = props;

  const [isIntersecting, setIsIntersecting] = useState<boolean>(false);

  useEffect(() => {
    if (!element) {
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      setIsIntersecting(entries[0].isIntersecting);
    }, observerConfig);

    observer.observe(element);

    return () => observer.disconnect();
  }, [element, observerConfig]);

  return isIntersecting;
};

export default useIntersectionObserver;
