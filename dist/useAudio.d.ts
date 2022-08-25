export declare type UseAudioProps = {
    url: string;
    initialState?: boolean;
};
export declare const useAudio: (props: UseAudioProps) => {
    isPlaying: boolean;
    onPlay: () => void;
    onPause: () => void;
    onToggle: () => void;
};
