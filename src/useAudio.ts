import { useState, useEffect, useMemo, useCallback } from 'react';

export type UseAudioProps = {
  url: string;
  initialState?: boolean;
};

export const useAudio = (props: UseAudioProps) => {
  const { url, initialState } = props;

  const [isPlaying, setIsPlaying] = useState<boolean>(!!initialState);

  const audio = useMemo<HTMLAudioElement>(() => {
    const audio = new Audio(url);

    if (initialState) {
      audio.play();
    }

    return audio;
  }, [url, initialState]);

  useEffect(() => {
    const handleAudioEnded = () => setIsPlaying(false);

    audio.addEventListener('ended', handleAudioEnded);

    return () => {
      audio.removeEventListener('ended', handleAudioEnded);
    };
  }, [audio]);

  const onPlay = useCallback(() => {
    audio.play();

    setIsPlaying(true);
  }, [audio]);

  const onPause = useCallback(() => {
    audio.pause();

    setIsPlaying(false);
  }, [audio]);

  const onToggle = useCallback(() => {
    isPlaying ? onPause() : onPlay();
  }, [audio, isPlaying]);

  return { isPlaying, onPlay, onPause, onToggle };
};
