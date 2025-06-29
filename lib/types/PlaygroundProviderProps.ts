import { CodeMirrorThemes } from './CodeMirroThemes';
import { FileBarThemes } from './FileBarThemes';
import { UserFile } from './UserFile';

export interface PlaygroundProviderProps {
  children: React.ReactNode;
  /**
   * The default files to display in the file bar.
   */
  defaultFiles: Array<UserFile>;
  /**
   * Customize the files bar.
   */
  fileBarThemes?: FileBarThemes;
  /**
   * CodeMirror compatible themes: light and dark.
   */
  codeMirrorThemes?: CodeMirrorThemes;
}
