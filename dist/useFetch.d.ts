export declare type FetchConfig = {
    url: string;
    requestConfig?: RequestInit;
};
export declare const useFetch: <T>(config: FetchConfig) => {
    data: T | undefined;
    loading: boolean;
    error: boolean;
    refetch: () => Promise<void>;
};
