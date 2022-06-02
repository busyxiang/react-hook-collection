declare type Props = {
    url: string;
    onLoad?: () => void;
};
declare const useInjectScript: (props: Props) => {
    loaded: boolean;
    error: boolean;
};
export default useInjectScript;
