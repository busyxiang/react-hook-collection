export declare type UseLazyFetchProps = {
    url: string;
    requestConfig?: RequestInit;
};
export declare const useLazyFetch: <T>(props: UseLazyFetchProps) => readonly [() => Promise<void>, {
    readonly data: T | undefined;
    readonly loading: boolean;
    readonly error: boolean;
}];
