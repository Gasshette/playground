import ReactCodeMirror, { EditorView } from '@uiw/react-codemirror';
import { useRef, useState, useEffect } from 'react';
import { useDebounce } from 'use-debounce';
import { resetSizes } from '../hooks/useSizes';
import { getPaddingValues } from '../utils';
import { Handle } from './Handle';
import { PlaygroundProps } from '../types/PlaygroundProps';
import { javascript } from '@codemirror/lang-javascript';

const editorConfig = {
  theme: 'dark' as 'dark' | 'light',
  indentWithTab: true,
  width: '100%',
  height: '100%',
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

export const HANDLE_THICKNESS = 8;
const PLAYGROUND_TEMPLATE_KEY = 'playground_template';
const PLAYGROUND_VERTICAL_LAYOUT_KEY = 'playground_vertical_layout';

export const Playground = (props: PlaygroundProps) => {
  const {
    isDebugMode,
    storeTemplate = true,
    template: defaultTemplate,
    parentRef,
    wrapperRef: customWrapperRef,
    headerRef: customHeaderRef,
    containerRef: customContainerRef,
    editorRef: customEditorRef,
    handleRef: customHandleRef,
    viewRef: customViewRef,
    viewDisplayCondition = true,
    autoRefresh = true,
    headerClassName,
    containerClassName,
    handleClassName,
    headerStyle,
    containerStyle,
    handleStyle,
    viewClassName,
    viewStyle,
    wrapperBackgroundColor,
    Header,
    View,
    Editor,
    onTemplateChange,
    onBeforeResize,
    onAfterResize
  } = props;

  const defaultHeaderRef = useRef<HTMLDivElement>(null);
  const defaultWrapperRef = useRef<HTMLDivElement>(null);
  const defaultContainerRef = useRef<HTMLDivElement>(null);
  const defaultEditorRef = useRef<HTMLDivElement>(null);
  const defaultHandleRef = useRef<HTMLDivElement>(null);
  const defaultViewRef = useRef<HTMLDivElement>(null);

  const headerRef = customHeaderRef ?? defaultHeaderRef;
  const wrapperRef = customWrapperRef ?? defaultWrapperRef;
  const containerRef = customContainerRef ?? defaultContainerRef;
  const editorRef = customEditorRef ?? defaultEditorRef;
  const handleRef = customHandleRef ?? defaultHandleRef;
  const viewRef = customViewRef ?? defaultViewRef;

  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isVerticaLayout, setIsVerticalLayout] = useState(
    localStorage.getItem(PLAYGROUND_VERTICAL_LAYOUT_KEY) === 'true'
  );

  // If rememberTemplate is set to false, the default template will be used
  const [template, setTemplate] = useState<string>(
    localStorage.getItem(PLAYGROUND_TEMPLATE_KEY) || defaultTemplate || ''
  );

  const [debouncedTemplate] = useDebounce(template, 500);

  const resetAllSizes = () => {
    resetSizes();

    if (editorRef.current && viewRef.current) {
      editorRef.current.style.height = '100%';
      editorRef.current.style.width = '100%';
      viewRef.current.style.height = '100%';
      viewRef.current.style.width = '100%';
    }
  };

  const handleContainerSize = () => {
    // get dimension of the container and calculate the space available
    // from the top of the container to the bottom of the viewport and set the height of the container
    if (containerRef.current && wrapperRef.current) {
      const container = containerRef.current;
      const containerRect: DOMRect = container.getBoundingClientRect();
      const parentRect: DOMRect | undefined = parentRef?.current?.getBoundingClientRect();
      const parentPadding = getPaddingValues(parentRef);

      // Get the parentRef height and, if not set, take the window height
      const parentHeight = parentRect && !isFullScreen ? parentRect.height : window.innerHeight;

      if (isFullScreen) {
        // If the container is full screen, we have to set the height of the container to the window height minus the header height
        container.style.height = `calc(100vh - ${
          headerRef.current?.getBoundingClientRect().height
        }px)`;
      } else {
        // We have to add the parentRef.top position to the height of the container if it exists
        // We also remove the scrollY to avoid enlarging the container if the user has scrolled down before refreshing the page
        const parentRefTop = parentRect?.top || 0 - window.scrollY;
        let containerHeight = parentHeight - containerRect.top + parentRefTop;
        // Substract the padding of the wrapper if no parentRef is given.
        // It means we want the playground to take the full height of the window

        if (parentRect) {
          containerHeight += parentPadding.paddingTop;
        }

        // if there is a parent, we have to substract the padding of the parent
        containerHeight -= parentPadding.paddingBottom;
        containerHeight -= parentPadding.paddingTop;

        container.style.height = `${containerHeight}px`;
      }
    }
  };

  const handleFullScreen = () => {
    if (wrapperRef.current && containerRef.current) {
      resetAllSizes();
      setIsFullScreen(!isFullScreen);
    }
  };

  useEffect(() => {
    if (viewRef.current) {
      viewRef.current.style.overflow = 'auto';
    }
  }, [viewRef.current]);

  useEffect(() => {
    if (wrapperRef.current) {
      const wrapper = wrapperRef.current;

      if (!isFullScreen) {
        // remove style applied when the playground is in full screen
        document.body.style.overflow = 'auto';
        wrapper.style.position = 'relative';
        wrapper.style.inset = 'unset';
        wrapper.style.zIndex = 'unset';
      } else {
        document.body.style.overflow = 'hidden';
        wrapper.style.position = 'fixed';
        wrapper.style.inset = '0';
        wrapper.style.border = 'none';
        wrapper.style.margin = '0';
        wrapper.style.zIndex = '9999';
      }
    }

    handleContainerSize();
  }, [isFullScreen]);

  useEffect(() => {
    onTemplateChange && onTemplateChange(debouncedTemplate);
  }, [debouncedTemplate]);

  useEffect(() => {
    handleContainerSize();
  }, [containerRef.current, parentRef?.current]);

  // reset the height of the code mirror and the view when the layout changes
  useEffect(() => {
    localStorage.setItem(PLAYGROUND_VERTICAL_LAYOUT_KEY, isVerticaLayout.toString());
    resetAllSizes();
  }, [isVerticaLayout]);

  useEffect(() => {
    if (isDebugMode) {
      console.log('Playground template changed', template);
      console.log('Playground template debounced', debouncedTemplate);
    }
  }, [template, debouncedTemplate]);

  return (
    <div
      ref={wrapperRef}
      className="modular-playground-wrapper"
      style={{ backgroundColor: wrapperBackgroundColor ?? '#FFF' }}>
      <header
        ref={headerRef}
        className={`modular-playground-header${headerClassName ? ` ${headerClassName}` : ''}`}
        style={headerStyle}>
        {Header && (
          <Header
            {...props}
            isFullScreen={isFullScreen}
            isVertical={isVerticaLayout}
            handleFullScreen={handleFullScreen}
            setIsVertical={setIsVerticalLayout}
          />
        )}
      </header>
      {viewDisplayCondition && (
        <div
          ref={containerRef}
          className={`modular-playground-container${
            containerClassName ? ` ${containerClassName}` : ''
          }`}
          style={{ overflow: 'hidden', ...containerStyle }}>
          <div
            style={{
              display: 'flex',
              flexDirection: isVerticaLayout ? 'column' : 'row',
              alignItems: 'stretch',
              height: '100%'
            }}>
            <div
              ref={editorRef}
              style={{
                overflow: 'auto',
                height: '100%',
                width: '100%'
              }}>
              {Editor ? (
                <Editor {...props} editorRef={editorRef} />
              ) : (
                <ReactCodeMirror
                  {...editorConfig}
                  className="code-mirror"
                  style={{
                    height: '100%',
                    width: '100%'
                  }}
                  extensions={[javascript(), EditorView.lineWrapping]}
                  value={debouncedTemplate}
                  onChange={(value: string) => {
                    storeTemplate && localStorage.setItem(PLAYGROUND_TEMPLATE_KEY, value);
                    setTemplate(value);
                  }}
                />
              )}
            </div>
            <Handle
              vertical={!isVerticaLayout}
              containerRef={containerRef}
              handleRef={handleRef}
              firstDivRef={editorRef}
              secondDivRef={viewRef}
              style={handleStyle}
              className={handleClassName}
              onBeforeResize={onBeforeResize}
              onAfterResize={onAfterResize}
            />
            {View ? (
              <View
                {...props}
                template={autoRefresh ? debouncedTemplate : defaultTemplate}
                viewRef={viewRef}
              />
            ) : (
              <div ref={viewRef} style={viewStyle} className={viewClassName}>
                {autoRefresh ? debouncedTemplate : defaultTemplate}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
