import { ReactCodeMirrorRef } from '@uiw/react-codemirror';
import { RefObject, useRef, useContext, createContext, useState } from 'react';

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

const Context = createContext<PlaygroundContext | null>(null);

export const PlaygroundProvider = (props: PlaygroundProviderProps) => {
  const [playgroundState, setPlaygroundState] = useState<PlaygroundState>({
    direction: 'row',
    isFullScreen: false,
    isFullScreenDOMApplied: false
  });

  const wrapperRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const paneWrapperRef = useRef<HTMLDivElement>(null);
  const editorPaneRef = useRef<HTMLDivElement>(null);
  const viewPaneRef = useRef<HTMLDivElement>(null);
  const handleRef = useRef<HTMLDivElement>(null);
  const codeMirrorRef = useRef<ReactCodeMirrorRef>(null);

  const value = {
    playgroundState,
    setPlaygroundState,
    wrapperRef,
    headerRef,
    paneWrapperRef,
    editorPaneRef,
    viewPaneRef,
    handleRef,
    codeMirrorRef
  };

  return <Context.Provider value={value}>{props.children}</Context.Provider>;
};

export const usePlaygroundContext = () => {
  const context = useContext(Context);
  if (!context) {
    throw new Error('usePlaygroundContext must be used within a PlaygroundProvider');
  }

  return context;
};
