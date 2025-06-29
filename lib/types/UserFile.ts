import { FileNamePattern } from './CodeMirrorFile';

export interface UserFile {
  name: FileNamePattern;
  content?: string;
}
