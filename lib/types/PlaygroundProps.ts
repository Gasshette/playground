import { RefObject } from 'react';
import { ResizeEvent } from '../components/Handle';
import { PlaygroundHeaderProps } from './PlaygroundHeaderProps';

export interface PlaygroundProps {
  /**
   * Whether the template is stored in the localStorage automatically or not.
   */
  storeTemplate?: boolean;

  /**
   * The default template.
   * If autoRefresh is set to false, this template is provided to the view instead of the newly written template.
   */
  template?: string;

  /**
   * A reference to the parent element of the playground. Used to do calculation of the sizes depending on the parent wrapping the whole playground component.
   */
  parentRef?: RefObject<HTMLDivElement>;

  /**
   * A reference to the wrapper element of the playground.
   */
  wrapperRef?: RefObject<HTMLDivElement>;
  /**
   * A reference to the header element of the playground.
   */
  headerRef?: RefObject<HTMLDivElement>;

  /**
   * A reference to the container element of the playground.
   * It wraps the code editor and the view and only appears when the viewDisplayCondition is set to true
   */
  containerRef?: RefObject<HTMLDivElement>;

  /**
   * A reference to the CodeMirror editor wrapper.
   */
  editorRef?: RefObject<HTMLDivElement>;

  /**
   * A reference to the handle element of the playground.
   */
  handleRef?: RefObject<HTMLDivElement>;

  /**
   * A reference to the view element of the playground.
   */
  viewRef?: RefObject<HTMLDivElement>;

  /**
   * Whether the view is displayed or not.
   */
  viewDisplayCondition?: boolean;

  /**
   * Whether the debug mode is enabled or not.
   */
  isDebugMode?: boolean;

  /**
   * A custom classname for the header element of the playground.
   */
  headerClassName?: string;

  /**
   * A custom classname for the container element of the playground.
   */
  containerClassName?: string;

  /**
   * A custom classname for the handle element of the playground.
   */
  handleClassName?: string;

  /**
   * A custom classname for the view element of the playground.
   */
  viewClassName?: string;

  /**
   * A custom style for the header element of the playground.
   */
  headerStyle?: React.CSSProperties;

  /**
   * A custom style for the container element of the playground.
   */
  containerStyle?: React.CSSProperties;

  /**
   * A custom style for the handle element of the playground.
   */
  handleStyle?: React.CSSProperties;

  /**
   * A custom style for the view element of the playground.
   */
  viewStyle?: React.CSSProperties;

  /**
   * A custom background color for the wrapper element of the playground.
   * It will be used to set the background color of the component.
   */
  wrapperBackgroundColor?: string;

  /**
   * Whether the template is refreshed automatically or not.
   * If set to false, the defaultTemplate is provided to the view instead of the newly written template.
   */
  autoRefresh?: boolean;

  /**
   * A component displayed in the header.
   */
  Header?: React.ComponentType<PlaygroundHeaderProps>;

  /**
   * A component to use as the view.
   * If not set, a default view will be used.
   */
  View?: React.ComponentType<PlaygroundProps>;

  /**
   * A component to use as the editor.
   * If not set, a default editor will be used (ReactCodemirror from @uiw/react-codemirror).
   */
  Editor?: React.ComponentType<PlaygroundProps>;

  /**
   * A function called when the template is changed
   * @param template The new template
   */
  onTemplateChange?: (template: string) => void;

  /**
   * A function called on keydown event attached to the handle
   * @param props Handle props accessible from the event
   */
  onBeforeResize?: (props: ResizeEvent) => void;

  /**
   * A function called on keyup event attached to the handle
   * @param props Handle props accessible from the event
   * @returns
   */
  onAfterResize?: (props: ResizeEvent) => void;
}
