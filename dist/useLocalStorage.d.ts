declare type Props<T> = {
    key: string;
    defaultValue: T;
};
declare const useLocalStorage: <T extends string>({ key, defaultValue }: Props<T>) => readonly [T, (value: T | ((val: T) => T)) => void, () => void];
export default useLocalStorage;
