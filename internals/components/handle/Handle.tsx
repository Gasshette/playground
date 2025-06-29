import { useState, useRef, CSSProperties, useEffect, useCallback } from 'react';
import { PlaygroundProps, usePlaygroundContext } from '@lib/index';

export const Handle = (props: PlaygroundProps) => {
  const {
    fileBarThemes: theme,
    playgroundState: {
      editorConfig: { theme: selectedTheme }
    }
  } = usePlaygroundContext();

  const {
    handleClassNames,
    handleStyle,
    viewPaneOverflow,
    handleColor = selectedTheme === 'dark'
      ? theme.dark.colors.indicator
      : theme.light.colors.indicator
  } = props;

  const [hover, setHover] = useState<boolean>(false);

  const { playgroundState, paneWrapperRef, editorPaneRef, viewPaneRef, handleRef } =
    usePlaygroundContext();
  const { direction, isFullScreenFinished: isFullScreenDOMApplied } = playgroundState;

  const lockHover = useRef(false);
  const timeout = useRef<NodeJS.Timeout>();

  const style: CSSProperties = {
    position: 'absolute',
    ...(direction === 'row'
      ? {
          top: 0
        }
      : {
          left: 0
        }),
    width: direction === 'row' ? 6 : '100%',
    height: direction === 'row' ? '100%' : 6,
    backgroundColor: handleColor,
    opacity: hover ? 1 : 0.1
  };

  const handleMouseEnter = () => {
    if (handleRef.current)
      handleRef.current.style.cursor = direction === 'row' ? 'col-resize' : 'row-resize';

    if (!hover) {
      timeout.current = setTimeout(() => setHover(true), 200);
    }
  };

  const handleMouseLeave = () => {
    if (handleRef.current) handleRef.current.style.cursor = 'unset';
    if (!lockHover.current) {
      if (timeout.current) clearTimeout(timeout.current);
      setHover(false);
    }
  };

  const enableRatioResize = useCallback(
    (
      container: HTMLElement,
      leftPane: HTMLElement,
      rightPane: HTMLElement,
      handle: HTMLElement,
      direction: 'row' | 'column' = 'row'
    ) => {
      const onPointerDown = (e: PointerEvent) => {
        lockHover.current = true;

        // disable pointer events. If an iframe is displayed in the view, it prevents the drag to fail when dragging on the right side (viewPane side, aka iframe side)
        rightPane.style.pointerEvents = 'none';
        // Disable the overflow to prevent the content to scroll as the drag occurs
        rightPane.style.overflow = 'hidden';

        // Depending on direction, choose relevant axis and sizes
        const startPos = direction === 'row' ? e.clientX : e.clientY;
        const containerSize =
          direction === 'row'
            ? container.getBoundingClientRect().width
            : container.getBoundingClientRect().height;
        const leftSize =
          direction === 'row'
            ? leftPane.getBoundingClientRect().width
            : leftPane.getBoundingClientRect().height;

        const onPointerMove = (e: PointerEvent) => {
          const currentPos = direction === 'row' ? e.clientX : e.clientY;
          const delta = currentPos - startPos;
          const newLeftSize = leftSize + delta;

          // Clamp to keep minimal size
          const min = 0;
          const max = containerSize - min;
          const clampedLeft = Math.max(min, Math.min(newLeftSize, max));

          const leftRatio = clampedLeft / containerSize;
          const rightRatio = 1 - leftRatio;

          // Update flex ratios for both panes
          leftPane.style.flex = `${leftRatio} 0 0%`;
          rightPane.style.flex = `${rightRatio} 0 0%`;

          // Update handle position: left for row, top for column
          if (direction === 'row') {
            handle.style.left = `${clampedLeft - 3}px`;
            handle.style.top = '0px';
          } else {
            handle.style.top = `${clampedLeft - 3}px`;
            handle.style.left = '0px';
          }
        };

        const onPointerUp = () => {
          lockHover.current = false;

          rightPane.style.pointerEvents = 'auto';
          rightPane.style.overflow = viewPaneOverflow ?? 'hidden';

          clearTimeout(timeout.current);
          setHover(false);

          document.removeEventListener('pointermove', onPointerMove, true);
          document.removeEventListener('pointerup', onPointerUp, true);
        };

        document.addEventListener('pointermove', onPointerMove, true);
        document.addEventListener('pointerup', onPointerUp, true);
      };

      handle.addEventListener('pointerdown', onPointerDown, true);
    },
    [viewPaneOverflow]
  );

  useEffect(() => {
    const handlePositioning = () => {
      if (editorPaneRef.current && handleRef.current) {
        const rect = editorPaneRef.current.getBoundingClientRect();

        if (direction === 'row') {
          handleRef.current.style.left = `${rect.width - 3}px`;
        } else {
          handleRef.current.style.top = `${rect.height - 3}px`;
        }
      }
    };

    handlePositioning();

    let resizeTimeout: ReturnType<typeof setTimeout> | null = null;

    const onResize = () => {
      if (resizeTimeout) {
        clearTimeout(resizeTimeout);
      }

      resizeTimeout = setTimeout(() => {
        // Called at the end of the resize
        handlePositioning();
      }, 200);
    };

    window.addEventListener('resize', onResize);

    return () => {
      if (resizeTimeout) {
        clearTimeout(resizeTimeout);
      }

      window.removeEventListener('resize', onResize);
    };
  }, [direction, isFullScreenDOMApplied, editorPaneRef, handleRef]);

  useEffect(() => {
    if (
      paneWrapperRef.current &&
      editorPaneRef.current &&
      viewPaneRef.current &&
      handleRef.current
    ) {
      enableRatioResize(
        paneWrapperRef.current,
        editorPaneRef.current,
        viewPaneRef.current,
        handleRef.current,
        direction
      );
    }

    return () => {
      clearTimeout(timeout.current);
    };
  }, [
    direction,
    isFullScreenDOMApplied,
    paneWrapperRef,
    editorPaneRef,
    viewPaneRef,
    handleRef,
    enableRatioResize
  ]);

  return (
    <div
      ref={handleRef}
      style={{ ...style, ...handleStyle }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`playgroundHandle ${handleClassNames ?? ''}`.trim()}></div>
  );
};
