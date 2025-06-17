import ReactCodeMirror from '@uiw/react-codemirror';
import { PlaygroundProps } from '../lib/types/PlaygroundProps';
import { usePlaygroundContext } from '../lib/Contexts/PlaygroundProvider';

const editorConfig = {
  theme: 'dark' as 'dark' | 'light',
  indentWithTab: true,
  width: '100%',
  height: '100%',
  style: { height: '100%' },
  basicSetup: {
    syntaxHighlighting: true,
    tabSize: 2,
    bracketMatching: true,
    closeBrackets: true,
    highlightActiveLine: true,
    lineNumbers: true,
    indentOnInput: true
  }
};

export const EditorPane = (props: PlaygroundProps) => {
  const { editorPaneRef, codeMirrorRef } = usePlaygroundContext();

  return (
    <div ref={editorPaneRef} style={{ flex: 1, overflow: 'hidden' }}>
      <ReactCodeMirror ref={codeMirrorRef} {...editorConfig} {...props.codeMirrorProps} />
    </div>
  );
};
