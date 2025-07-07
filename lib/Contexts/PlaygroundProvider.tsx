import { EditorState, ReactCodeMirrorRef } from '@uiw/react-codemirror';
import { useRef, useContext, createContext, useState, useMemo, useCallback } from 'react';
import { color, oneDark } from '@codemirror/theme-one-dark';
import { FileBarThemes } from '@lib/types/FileBarThemes';
import debounce from 'lodash.debounce';
import { CodeMirrorThemes } from '@lib/types/CodeMirroThemes';
import { PlaygroundState } from '@lib/types/PlaygroundState';
import { EventBus, EventName } from '@lib/types/EventBus';
import { PlaygroundProviderProps } from '@lib/types/PlaygroundProviderProps';
import { PlaygroundContext } from '@lib/types/PlaygroundContext';

const Context = createContext<PlaygroundContext | null>(null);

const defaultUserTheme: FileBarThemes = {
  dark: {
    colors: {
      background: color.darkBackground,
      color: color.ivory,
      danger: color.coral,
      indicator: color.cursor,
      hover: color.selection
    }
  },
  light: {
    colors: {
      background: '#ffffff',
      color: '#24292e',
      danger: '#d73a49',
      indicator: '#0366d6',
      hover: '#f6f8fa'
    }
  }
};

export const PlaygroundProvider = (props: PlaygroundProviderProps) => {
  const { fileBarThemes = defaultUserTheme, defaultFiles = [], codeMirrorThemes } = props;

  const [playgroundState, setPlaygroundState] = useState<PlaygroundState>({
    direction: 'row',
    isFullScreenStarted: false,
    isFullScreenFinished: false,
    files:
      defaultFiles.length > 0
        ? defaultFiles.map((file) => ({
            name: file.name,
            state: EditorState.create({ doc: file.content })
          }))
        : [],
    currentFileName: defaultFiles.length > 0 ? defaultFiles[0].name : undefined,
    editorConfig: {
      lineWrapping: true,
      theme: 'dark'
    }
  });

  const wrapperRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const paneWrapperRef = useRef<HTMLDivElement>(null);
  const editorPaneRef = useRef<HTMLDivElement>(null);
  const viewPaneRef = useRef<HTMLDivElement>(null);
  const handleRef = useRef<HTMLDivElement>(null);
  const fileBarRef = useRef<HTMLDivElement>(null);
  const codeMirrorRef = useRef<ReactCodeMirrorRef>();

  const listeners = useRef<Map<EventName, Set<() => void>>>(new Map());

  const subscribe = useCallback((event: EventName, fn: () => void) => {
    if (!listeners.current.has(event)) {
      listeners.current.set(event, new Set());
    }
    listeners.current.get(event)!.add(fn);
  }, []);

  const unsubscribe = useCallback((event: EventName, fn: () => void) => {
    listeners.current.get(event)?.delete(fn);
  }, []);

  const emit = useCallback((event: EventName) => {
    listeners.current.get(event)?.forEach((fn) => fn());
  }, []);

  const any = useCallback((event: EventName) => {
    return !!listeners.current.get(event)?.size;
  }, []);

  const events: EventBus = useMemo(
    () => ({
      subscribe,
      unsubscribe,
      emit,
      any
    }),
    [subscribe, unsubscribe, emit, any]
  );

  const filledCodeMirrorThemes: CodeMirrorThemes = useMemo(() => {
    return {
      dark: codeMirrorThemes?.dark ?? oneDark,
      light: codeMirrorThemes?.light
    };
  }, [codeMirrorThemes]);

  /**
   * Update the file state
   */
  const updateFileState = useCallback(
    debounce((newState: EditorState) => {
      setPlaygroundState((prev) => {
        const currentFileName = prev.currentFileName;
        const currentFile = prev.files.find((f) => f.name === currentFileName);

        if (currentFile && currentFile.state?.doc.toString() === newState.doc.toString()) {
          return prev;
        }

        return {
          ...prev,
          files: prev.files.map((file) =>
            file.name === currentFileName ? { ...file, state: newState } : file
          )
        };
      });
    }, 300),
    []
  );

  const value = useMemo(
    () => ({
      fileBarThemes,
      codeMirrorThemes: filledCodeMirrorThemes,
      events,
      playgroundState,
      setPlaygroundState,
      updateFileState,
      wrapperRef,
      headerRef,
      paneWrapperRef,
      editorPaneRef,
      viewPaneRef,
      handleRef,
      fileBarRef,
      codeMirrorRef
    }),
    [
      fileBarThemes,
      filledCodeMirrorThemes,
      events,
      updateFileState,
      playgroundState,
      setPlaygroundState,
      wrapperRef,
      headerRef,
      paneWrapperRef,
      editorPaneRef,
      viewPaneRef,
      handleRef,
      fileBarRef,
      codeMirrorRef
    ]
  );

  return <Context.Provider value={value}>{props.children}</Context.Provider>;
};

export const usePlaygroundContext = () => {
  const context = useContext(Context);
  if (!context) {
    throw new Error('usePlaygroundContext must be used within a PlaygroundProvider');
  }

  return context;
};
