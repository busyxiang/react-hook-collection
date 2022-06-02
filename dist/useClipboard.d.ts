export declare type UseClipboardProps = {
    text: string;
    successDurationInSeconds?: number;
};
export declare const useClipboard: (props: UseClipboardProps) => {
    isCopied: boolean;
    onCopy: () => void;
};
