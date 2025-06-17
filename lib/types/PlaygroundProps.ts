import { ReactCodeMirrorProps } from '@uiw/react-codemirror';
import { CSSProperties } from 'react';

export interface PlaygroundProps {
  /**
   * The Playground View.
   */
  View: React.FunctionComponent;
  /**
   * The Playground Header component. If provided, it will be displayed over the container.
   */
  Header?: React.FunctionComponent;
  /**
   * The Playground width.
   */
  width?: string | number;
  /**
   * The Playground height.
   */
  height?: string | number;
  /**
   * A style object that will be applied to the Playground wrapper.
   * The wrapper encapsulates the whole thing, header included.
   */
  wrapperStyle?: CSSProperties;
  /**
   * The classNames that will be passed to the wrapper.
   */
  wrapperClassNames?: string;
  /**
   * A style object that will be applied to the Playground pane wrapper.
   * The pane wrapper encapsulates the CodeMirror editor and the view.
   */
  paneWrapperStyle?: CSSProperties;
  /**
   * The classNames that will be passed to the pane wrapper.
   */
  paneWrapperClassNames?: string;
  /**
   * A style object that will be applied to the Playground handle.
   * The handle is hidden by default and appear by hovering between the editor and the view.
   */
  handleStyle?: CSSProperties;
  /**
   * The classNames that will be passed to the handle.
   */
  handleClassNames?: string;
  /**
   * The CodeMirror configuration object that will be passed to the editor.
   */
  codeMirrorProps?: ReactCodeMirrorProps;
}
