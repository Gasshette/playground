import { CodeMirrorFile } from './CodeMirrorFile';
import { EditorConfig } from './EditorConfig';

export interface PlaygroundState {
  /**
   * The Playground orientation.
   */
  direction: 'row' | 'column';
  /**
   * Triggers when the fullscreen is asked, before the style is applied.
   */
  isFullScreenStarted: boolean;
  /**
   * Triggers when the style is changed for a fullscreen view.
   */
  isFullScreenFinished: boolean;
  /**
   * The list of all files (deleted element not included).
   */
  files: Array<CodeMirrorFile>;
  /**
   * The currently selected file name.
   */
  currentFileName?: string;
  /**
   * The editor config.
   */
  editorConfig: EditorConfig;
}
