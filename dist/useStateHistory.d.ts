declare const useStateHistory: <T>({ initialValue }: {
    initialValue?: T | undefined;
}) => readonly [T, (value: T) => void, T[]];
export default useStateHistory;
