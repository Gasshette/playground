import ReactCodeMirror, {
  basicSetup,
  Compartment,
  EditorState,
  EditorView,
  Extension,
  ReactCodeMirrorRef,
  StateEffect,
  ViewUpdate
} from '@uiw/react-codemirror';
import { PlaygroundProps } from '../../../lib/types/PlaygroundProps';
import { usePlaygroundContext } from '../../../lib/Contexts/PlaygroundProvider';
import { FileBar } from '@int/components/fileBar/FileBar';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { langFactory } from '@lib/langFactory';
import { keymap } from '@codemirror/view';
import {
  defaultKeymap,
  moveLineUp,
  moveLineDown,
  copyLineUp,
  copyLineDown,
  deleteLine
} from '@codemirror/commands';
import './EditorPane.scss';

const defaultEditorSetup = {
  indentWithTab: true,
  width: '100%',
  height: '100%',
  style: { height: '100%' }
};

export const defaultBasicSetup = {
  syntaxHighlighting: true,
  tabSize: 2,
  bracketMatching: true,
  closeBrackets: true,
  highlightActiveLine: true,
  lineNumbers: true,
  indentOnInput: true
};

export const EditorPane = (props: PlaygroundProps) => {
  const { codeMirrorProps } = props;

  const [height, setHeight] = useState<string>();

  const {
    codeMirrorThemes,
    editorPaneRef,
    codeMirrorRef,
    fileBarRef,
    playgroundState,
    setPlaygroundState,
    updateFileState
  } = usePlaygroundContext();
  const { currentFileName, files, isFullScreenFinished, direction, editorConfig } = playgroundState;
  const { dark, light } = codeMirrorThemes;

  const langCompartment = useMemo(() => new Compartment(), []);
  const editorConfigCompartment = useMemo(() => new Compartment(), []);

  const handleUpdate = useCallback(
    (update: ViewUpdate) => {
      if (!update.docChanged) {
        return;
      }

      updateFileState(update.state);
    },
    [updateFileState]
  );

  const getEditorConfigExtensions = useCallback(() => {
    const extensions: Extension[] = [];

    if (editorConfig.lineWrapping) {
      extensions.push(EditorView.lineWrapping);
    }

    if (editorConfig.theme === 'dark' && dark) {
      extensions.push(dark);
    } else if (editorConfig.theme === 'light' && light) {
      extensions.push(light);
    }

    return extensions;
  }, [editorConfig, dark, light]);

  const getComputedExtensions = useCallback(
    (fileName?: string) => {
      const extensionsArray: Array<Extension> = [];
      const fileExtension = langFactory(fileName ?? '');

      if (codeMirrorProps?.extensions) {
        extensionsArray.push(codeMirrorProps.extensions);
      }

      const updateListener = EditorView.updateListener.of(handleUpdate);

      const newExtensions = [
        keymap.of([
          ...defaultKeymap,
          { key: 'Ctrl-Shift-ArrowUp', run: moveLineUp },
          { key: 'Ctrl-Shift-ArrowDown', run: moveLineDown },
          { key: 'Shift-Alt-ArrowUp', run: copyLineUp },
          { key: 'Shift-Alt-ArrowDown', run: copyLineDown },
          { key: 'Ctrl-Shift-k', run: deleteLine }
        ]),
        ...(fileExtension ? [langCompartment.of(fileExtension)] : []),
        editorConfigCompartment.of(getEditorConfigExtensions()),
        extensionsArray,
        basicSetup({
          ...defaultBasicSetup,
          ...(typeof codeMirrorProps?.basicSetup === 'object' ? codeMirrorProps?.basicSetup : {})
        }),
        updateListener
      ];

      return [...new Set(newExtensions)];
    },
    [
      codeMirrorProps?.basicSetup,
      codeMirrorProps?.extensions,
      editorConfigCompartment,
      langCompartment,
      handleUpdate,
      getEditorConfigExtensions
    ]
  );

  // Source: https://github.com/uiwjs/react-codemirror/issues/314#issuecomment-1557816378
  const refCallback = (editor: ReactCodeMirrorRef) => {
    if (!codeMirrorRef.current && editor?.editor && editor?.state && editor?.view) {
      const view = editor.view;

      const validFiles = [...files];
      // Build the state of the default provided files.
      files.forEach((file, i) => {
        if (!file.state) {
          console.error('No state found for the file name ', currentFileName);
          return;
        }

        const newState = EditorState.create({
          doc: file.state.doc.toString(),
          extensions: getComputedExtensions(validFiles[i].name)
        });

        validFiles[i].state = newState;
      });

      codeMirrorRef.current = editor;
      setPlaygroundState((prev) => ({
        ...prev,
        files: validFiles,
        currentFileName: validFiles[0].name
      }));
      requestAnimationFrame(() => view.setState(validFiles[0].state!));
    }
  };

  useEffect(() => {
    if (codeMirrorRef.current?.view) {
      // No file in th filebar
      if (!currentFileName) {
        codeMirrorRef.current.view.setState(
          EditorState.create({
            doc: 'Add a file to start coding !',
            extensions: getComputedExtensions(currentFileName)
          })
        );

        // Set to read-only
        codeMirrorRef.current.view.dispatch({
          effects: StateEffect.appendConfig.of(EditorView.editable.of(false))
        });
        return;
      }

      const file = files.find((file) => file.name === currentFileName);

      if (!file) {
        return;
      }

      const updateConfigCompartment = (state: EditorState) => {
        if (!codeMirrorRef.current?.view) {
          return;
        }

        const transaction = state.update({
          effects: editorConfigCompartment.reconfigure(getEditorConfigExtensions())
        });
        codeMirrorRef.current.view.dispatch(transaction);
      };

      if (file.state) {
        // File changed or switch file
        codeMirrorRef.current.view.setState(file.state);
        updateConfigCompartment(file.state);
        return;
      }

      // New file created
      const newState = EditorState.create({
        doc: '',
        extensions: getComputedExtensions(file.name)
      });

      codeMirrorRef.current.view.setState(newState);
      updateConfigCompartment(newState);
    }
  }, [
    files,
    currentFileName,
    direction,
    isFullScreenFinished,
    codeMirrorRef,
    editorConfig,
    editorConfigCompartment,
    getEditorConfigExtensions,
    getComputedExtensions
  ]);

  useEffect(() => {
    // Calculate the height of the editor based on the fileBar height
    // Mandatory for the editor content scrollbar to be visible when it overflows
    if (fileBarRef.current) {
      const rect = fileBarRef.current.getBoundingClientRect();
      setHeight(`calc(100% - ${rect.height}px)`);
    }
  }, [fileBarRef]);

  return (
    <div ref={editorPaneRef} style={{ flex: 1, overflow: 'hidden' }}>
      <FileBar {...props} />
      {height && (
        <ReactCodeMirror
          ref={refCallback}
          theme={editorConfig.theme}
          {...defaultEditorSetup}
          {...props.codeMirrorProps}
          extensions={getComputedExtensions(currentFileName)} // mandatory to prevents extensions disappearance when manipulating states and compartment. Should not be necessary imo
          height={height}
          style={{
            ...defaultEditorSetup.style,
            ...props.codeMirrorProps?.style,
            height
          }}
          onUpdate={handleUpdate}
        />
      )}
    </div>
  );
};
