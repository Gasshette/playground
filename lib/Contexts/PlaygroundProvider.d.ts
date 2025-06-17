import { ReactCodeMirrorRef } from '@uiw/react-codemirror';
import { RefObject } from 'react';
export interface PlaygroundState {
    direction: 'row' | 'column';
    isFullScreen: boolean;
    isFullScreenDOMApplied: boolean;
}
export interface PlaygroundContext {
    playgroundState: PlaygroundState;
    setPlaygroundState: React.Dispatch<React.SetStateAction<PlaygroundState>>;
    wrapperRef: RefObject<HTMLDivElement>;
    headerRef: RefObject<HTMLDivElement>;
    paneWrapperRef: RefObject<HTMLDivElement>;
    editorPaneRef: RefObject<HTMLDivElement>;
    viewPaneRef: RefObject<HTMLDivElement>;
    handleRef: RefObject<HTMLDivElement>;
    codeMirrorRef: RefObject<ReactCodeMirrorRef>;
}
interface PlaygroundProviderProps {
    children: React.ReactNode;
}
export declare const PlaygroundProvider: (props: PlaygroundProviderProps) => import("react/jsx-runtime").JSX.Element;
export declare const usePlaygroundContext: () => PlaygroundContext;
export {};
