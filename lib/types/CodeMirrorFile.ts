import { EditorState } from '@uiw/react-codemirror';

export type FileNamePattern = `${string | null}.${string}`;
export interface CodeMirrorFile {
  name: FileNamePattern;
  state?: EditorState;
}
