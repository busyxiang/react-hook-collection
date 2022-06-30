export declare type useValueProps<T> = {
    value: T;
    onChange: (newValue: T) => void;
};
export declare const useValue: <T>(props: useValueProps<T>) => T;
