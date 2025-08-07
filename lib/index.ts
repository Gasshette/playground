/** Components*/
export * from './components/playground';

/** Context */
export * from './Contexts/PlaygroundProvider';

/** Types */
export * from './types/PlaygroundProps';
export * from './types/PlaygroundContext';
export * from './types/CodeMirroThemes';
export * from './types/CodeMirrorFile';
export * from './types/CodeMirrorThemeOptions';
export * from './types/EditorConfig';
export * from './types/EventBus';
export * from './types/FileBarThemes';
export * from './types/UserFile';
export * from './utils';

/* CodeMirror */
export * from '@codemirror/view';
export * from '@codemirror/state';
export * from '@codemirror/commands';
export {
  type BasicSetupOptions,
  type MinimalSetupOptions,
  basicSetup,
  minimalSetup
} from '@uiw/codemirror-extensions-basic-setup';
export {
  type ReactCodeMirrorProps,
  type ReactCodeMirrorRef,
  type DefaultExtensionsOptions,
  type UseCodeMirror,
  type Statistics,
  getDefaultExtensions,
  useCodeMirror,
  getStatistics
} from '@uiw/react-codemirror';
