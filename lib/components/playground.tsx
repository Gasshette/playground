import { useState, CSSProperties, useMemo, useEffect } from 'react';
import { PlaygroundProps } from '../types/PlaygroundProps';
import { usePlaygroundContext } from '../Contexts/PlaygroundProvider';
import { InnerPlayground } from '@int/InnerPlayground';
const DEFAULT_HEIGHT = 400;

export const Playground = (props: PlaygroundProps) => {
  const { Header, width, height, wrapperStyle, wrapperClassNames } = props;

  const [paneWrapperHeight, setPaneWrapperHeight] = useState<string | number>(DEFAULT_HEIGHT);
  const { playgroundState, setPlaygroundState, wrapperRef, headerRef } = usePlaygroundContext();

  const { isFullScreen } = playgroundState;

  const style: CSSProperties = useMemo(
    () => ({
      ...(isFullScreen
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
            overflow: 'hidden'
          }),
      ...wrapperStyle
    }),
    [isFullScreen, width, height, wrapperStyle]
  );

  const isNumeric = (value: string | number): boolean => {
    const num = Number(value);
    return !isNaN(num) && isFinite(num);
  };

  useEffect(() => {
    let newHeight: string | number | undefined = undefined;

    if (headerRef.current && wrapperRef.current) {
      if (!height || isFullScreen) {
        // Do calculation for the panes (editor and view) to expand to te end of the viewport (not exceeding the viewport height by removing the scrollY)
        const rect = headerRef.current.getBoundingClientRect();
        newHeight = `calc(100dvh - ${isFullScreen ? rect.height : rect.bottom + window.scrollY}px)`;
      } else {
        // Do calculation for the panes to have the given height - the header height
        const rect = headerRef.current.getBoundingClientRect();
        const validHeight = isNumeric(height) ? `${height}px` : height;
        newHeight = `calc(${validHeight} - ${rect.height}px)`;
      }

      setPaneWrapperHeight(newHeight);
      setPlaygroundState((prev) => ({ ...prev, isFullScreenDOMApplied: prev.isFullScreen }));
    }
  }, [headerRef.current, height, setPaneWrapperHeight, isFullScreen]);

  useEffect(() => {
    document.body.style.overflow = isFullScreen ? 'hidden' : 'auto';
  }, [isFullScreen]);

  return (
    <div
      ref={wrapperRef}
      className={`PlaygroundWrapper ${wrapperClassNames ?? ''}`.trim()}
      style={style}>
      <div ref={headerRef}>{Header && <Header />}</div>
      {paneWrapperHeight && <InnerPlayground {...props} paneWrapperHeight={paneWrapperHeight} />}
    </div>
  );
};
