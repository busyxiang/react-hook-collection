export declare type UseIntervalProps = {
    intervalInSeconds: number | null;
    callback: () => void;
};
export declare const useInterval: (props: UseIntervalProps) => void;
