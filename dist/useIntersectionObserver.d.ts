import { RefObject } from 'react';
declare type UseIntersectionObserverProps = {
    elementRef: RefObject<Element>;
    observerConfig?: IntersectionObserverInit;
};
declare const useIntersectionObserver: (props: UseIntersectionObserverProps) => boolean;
export default useIntersectionObserver;
