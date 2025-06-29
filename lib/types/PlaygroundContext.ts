import { EditorState, ReactCodeMirrorRef } from '@uiw/react-codemirror';
import { RefObject } from 'react';
import { CodeMirrorThemes } from './CodeMirroThemes';
import { EventBus } from './EventBus';
import { FileBarThemes } from './FileBarThemes';
import { PlaygroundState } from './PlaygroundState';

export interface PlaygroundContext {
  fileBarThemes: FileBarThemes;
  codeMirrorThemes: CodeMirrorThemes;
  events: EventBus;
  playgroundState: PlaygroundState;
  setPlaygroundState: React.Dispatch<React.SetStateAction<PlaygroundState>>;
  updateFileState: (newState: EditorState) => void;
  wrapperRef: RefObject<HTMLDivElement>;
  headerRef: RefObject<HTMLDivElement>;
  paneWrapperRef: RefObject<HTMLDivElement>;
  editorPaneRef: RefObject<HTMLDivElement>;
  viewPaneRef: RefObject<HTMLDivElement>;
  handleRef: RefObject<HTMLDivElement>;
  fileBarRef: RefObject<HTMLDivElement>;
  codeMirrorRef: React.MutableRefObject<ReactCodeMirrorRef | undefined>;
}
