import { useState, useCallback } from 'react';

export type UseClipboardProps = {
  text: string;
  successDurationInSeconds?: number;
};

export const useClipboard = (props: UseClipboardProps) => {
  const { text, successDurationInSeconds } = props;

  const [isCopied, setIsCopied] = useState<boolean>(false);

  const onCopy = useCallback(() => {
    navigator.clipboard.writeText(text);

    setIsCopied(true);

    if (successDurationInSeconds) {
      setTimeout(() => setIsCopied(false), successDurationInSeconds * 1000);
    }
  }, [text, successDurationInSeconds]);

  return { isCopied, onCopy };
};
