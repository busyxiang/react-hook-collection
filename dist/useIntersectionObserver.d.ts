declare type UseIntersectionObserverProps = {
    element: Element;
    observerConfig?: IntersectionObserverInit;
};
declare const useIntersectionObserver: (props: UseIntersectionObserverProps) => boolean;
export default useIntersectionObserver;
