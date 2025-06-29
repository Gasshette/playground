import { useState, CSSProperties, useMemo, useEffect } from 'react';
import { PlaygroundProps } from '../types/PlaygroundProps';
import { usePlaygroundContext } from '../Contexts/PlaygroundProvider';
import { InnerPlayground } from '@int/components/innerPlayground/InnerPlayground';
import { CssTheme } from '@int/components/CssTheme';

const DEFAULT_HEIGHT = 400;

export const Playground = (props: PlaygroundProps) => {
  const { Header, width, height, wrapperStyle, wrapperClassNames } = props;

  const [paneWrapperHeight, setPaneWrapperHeight] = useState<string | number>(DEFAULT_HEIGHT);
  const { playgroundState, setPlaygroundState, wrapperRef, headerRef } = usePlaygroundContext();

  const { isFullScreenStarted } = playgroundState;

  const style: CSSProperties = useMemo(
    () => ({
      ...(isFullScreenStarted
        ? {
            display: 'flex',
            flexDirection: 'column',
            position: 'fixed',
            inset: 0,
            width: '100%',
            height: '100%',
            zIndex: 9999,
            backgroundColor: '#FFF'
          }
        : {
            position: 'unset',
            display: 'flex',
            flexDirection: 'column',
            width: width ?? '100%',
            height: height ?? 'unset',
            zIndex: 'unset',
            overflow: 'visible'
          }),
      ...wrapperStyle
    }),
    [isFullScreenStarted, width, height, wrapperStyle]
  );

  const isNumeric = (value: string | number): boolean => {
    const num = Number(value);
    return !isNaN(num) && isFinite(num);
  };

  useEffect(() => {
    const handlePaneWrapperHeight = () => {
      let newHeight: string | number | undefined = undefined;

      if (headerRef.current && wrapperRef.current) {
        if (!height || isFullScreenStarted) {
          // Do calculation for the panes (editor and view) to expand to te end of the viewport (not exceeding the viewport height by removing the scrollY)
          const rect = headerRef.current.getBoundingClientRect();
          newHeight = `calc(${window.innerHeight}px - ${
            isFullScreenStarted ? rect.height : rect.bottom + window.scrollY
          }px)`;
        } else {
          // Do calculation for the panes to have the given height - the header height
          const rect = headerRef.current.getBoundingClientRect();
          const validHeight = isNumeric(height) ? `${height}px` : height;
          newHeight = `calc(${validHeight} - ${rect.height}px)`;
        }

        setPaneWrapperHeight(newHeight);
        setPlaygroundState((prev) => ({ ...prev, isFullScreenFinished: prev.isFullScreenStarted }));
      }
    };

    handlePaneWrapperHeight();

    let resizeTimeout: ReturnType<typeof setTimeout> | null = null;

    const onResize = () => {
      if (resizeTimeout) {
        clearTimeout(resizeTimeout);
      }

      resizeTimeout = setTimeout(() => {
        // Called at the end of the resize
        handlePaneWrapperHeight();
      }, 200);
    };

    window.addEventListener('resize', onResize);

    return () => {
      if (resizeTimeout) {
        clearTimeout(resizeTimeout);
      }

      window.removeEventListener('resize', onResize);
    };
  }, [
    height,
    isFullScreenStarted,
    headerRef,
    wrapperRef,
    setPlaygroundState,
    setPaneWrapperHeight
  ]);

  useEffect(() => {
    document.body.style.overflow = isFullScreenStarted ? 'hidden' : 'auto';
  }, [isFullScreenStarted]);

  return (
    <div
      ref={wrapperRef}
      id="modular-playground"
      className={`PlaygroundWrapper ${wrapperClassNames ?? ''}`.trim()}
      style={style}>
      <CssTheme containerRef={wrapperRef} />

      <div ref={headerRef}>{Header && <Header {...props} />}</div>
      {paneWrapperHeight && <InnerPlayground {...props} paneWrapperHeight={paneWrapperHeight} />}
    </div>
  );
};
